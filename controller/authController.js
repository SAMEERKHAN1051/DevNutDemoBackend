import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";
import User from "../models/authmodel.js";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import ValidationHelper from "../helper/validationHelper.js";
import ResponseHelper from "../helper/helper.js";
import validation from "../service/validation.service.js";
import Roles from "../enum/role.js";
import { getParamId, getUserId } from "../utlis/utilities.js";

const generateToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

const signup = async (req, res) => {
  const { error } = validation.validateSignup(req.body);
  if (error) return ValidationHelper.validation(res, error);

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseConstant.badRequest(res, "Email already exists");
    }

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    return ResponseConstant.created(res, "User registered successfully", {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      firebaseUid: firebaseUser.uid,
    });
  } catch (error) {
    return ResponseConstant.serverError(res, error);
  }
};

const login = async (req, res) => {
  const { error } = validation.validateLogin(req.body);
  if (error) return ValidationHelper.validation(res, error);

  const { email, password, deviceToken } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return ResponseConstant.badRequest(res, "Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return ResponseConstant.badRequest(res, "Invalid credentials");

    if (deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    const token = generateToken(user);

    const userData = user.toObject();
    delete userData.password;

    return ResponseConstant.success(res, "User login successful", {
      token,
      user: userData,
    });
  } catch (error) {
    return ResponseConstant.serverError(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const id = getUserId(req);
    const user = await User.findById(id).select("-password");
    if (!user) return ResponseConstant.notFound(res);

    return ResponseConstant.success(
      res,
      `User ${ResponseMessage.FETCHED}`,
      user
    );
  } catch (error) {
    return ResponseConstant.serverError(res, error);
  }
};

const socialLogin = async (req, res) => {
  const { id_token: idToken, device_token: deviceToken } = req.body;
  if (!idToken) {
    return ResponseConstant.badRequest(res, "Firebase ID token is required");
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decoded;

    if (!email || !name) {
      return ResponseConstant.badRequest(res, "Invalid Firebase user data");
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: uid,
        role: Roles.CUSTOMER,
        image: picture || null,
        deviceToken: deviceToken || null,
      });
      await user.save();
    } else if (deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    const token = generateToken(user);
    const userData = user.toObject();
    delete userData.password;

    await ResponseHelper.sendNotification(
      res,
      deviceToken,
      "Food Delivery",
      "Login Successfully"
    );

    return ResponseConstant.success(res, "Social login successful", {
      token,
      user: userData,
    });
  } catch (error) {
    return ResponseConstant.badRequest(
      res,
      "Invalid or expired Firebase token"
    );
  }
};

const logout = async (req, res) => {
  try {
    const id = getUserId(req);
    const user = await User.findById(id);
    if (!user) return ResponseConstant.notFound(res);

    user.deviceToken = null;
    await user.save();

    return ResponseConstant.success(res, "Logged out successfully");
  } catch (error) {
    return ResponseConstant.serverError(res);
  }
};

const setStatus = async (req, res) => {
  const userId = req.user?.userId;
  const { error } = validation.validateStatus(req.body);
  if (error) return ValidationHelper.validation(res, error);

  const { status } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return ResponseConstant.notFound(res);

    if (user.status === status) {
      return ResponseConstant.badRequest(res, `${status} is already set`);
    }

    user.status = status;
    await user.save();

    return ResponseConstant.success(res, ResponseMessage.UPDATED, {
      status: user.status,
    });
  } catch (error) {
    return ResponseConstant.serverError(res, error);
  }
};

const homePage = async (req, res) => {
  return ResponseConstant.success(res, "Everything is working");
};

export default {
  signup,
  login,
  getUser,
  socialLogin,
  logout,
  setStatus,
  homePage,
};
