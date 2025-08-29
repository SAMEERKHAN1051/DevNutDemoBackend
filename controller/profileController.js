import ResponseConstant from "../helper/helperConstant.js";
import validations from "../service/profile.service.js";
import ResponseMessage from "../enum/response_message.js";
import ValidationHelper from "../helper/validationHelper.js";
import Profile from "../model/profilemodel.js";
import {getParamId ,getUserId } from "../utlis/utilities.js";
import User from "../model/authmodel.js";
const addOrUpdateProfile = async (req, res) => {
  const { error } = validations.validateProfile(req.body);
  if (error) return ValidationHelper.validation(res, error);

  const {
    companyName,
    position,
    phoneNumber,
    location,
    address,
    website,
    experience,
    about,
    language,
    linkedin,
  } = req.body;

  try {
    const userId = getUserId(req);

    // ✅ Check if phoneNumber is already used by another user
    const existingPhone = await Profile.findOne({
      phoneNumber,
      userId: { $ne: userId }, // ensure not current user
    });

    if (existingPhone) {
      return ValidationHelper.AlreadyExistException(
        res,
        Profile,
        "phoneNumber",
        phoneNumber
      );
    }

    // Check if profile exists for the user
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // Create new profile
      profile = new Profile({
        userId,
        companyName,
        position,
        phoneNumber,
        location,
        address,
        website,
        experience,
        about,
        language,
        linkedin,
      });

      await profile.save();

      return ResponseConstant.created(
        res,
        `${companyName} ${ResponseMessage.SUCCESS}`,
        profile
      );
    } else {
      // Update existing profile
      profile.companyName = companyName;
      profile.position = position;
      profile.phoneNumber = phoneNumber;
      profile.location = location;
      profile.address = address;
      profile.website = website;
      profile.experience = experience;
      profile.about = about;
      profile.language = language;
      profile.linkedin = linkedin;

      await profile.save();

      return ResponseConstant.success(
        res,
        `${companyName} updated successfully`,
        profile
      );
    }
  } catch (err) {
    return ResponseConstant.serverError(res, err);
  }
};

const updateCvOrImage = async (req, res) => {
  try {
    const { error } = validations.validateFileForProfile(req.body);
    if (error) return ValidationHelper.validation(res, error);
    const userId = getUserId(req);
    let profile = await Profile.findOne({ userId: userId });
    let user = await User.findOne({ _id: userId });

    if (!profile) {
      return ResponseConstant.notFound(res, "Profile not found");
    }

    const { cv, image } = req.body;

    // Update CV string
    if (cv) {
      profile.cv = cv;
    }

    // Update profile image string
    if (image) {
      user.image = image;
    }

    await profile.save();
    await user.save();

    return ResponseConstant.success(res, "CV/Image updated successfully", {
      profile,
      user,
    });
  } catch (err) {
    return ResponseConstant.serverError(res, err);
  }
};
const updateVideoUrl = async (req, res) => {
  try {
    const userId = getUserId(req);
    let profile = await Profile.findOne({ userId: userId });
    if (!profile) {
      return ResponseConstant.notFound(res, "Profile not found");
    }

    const { video } = req.body;

    // Update CV string
    if (video) {
      profile.video = video;
    }
    await profile.save();
    return ResponseConstant.success(res, "CV/Image updated successfully", {
      profile,
      user,
    });
  } catch (err) {
    return ResponseConstant.serverError(res, err);
  }
};

const getProfile = async (req, res) => {
  const userId = getUserId(req);
  try {
    const profiles = await Profile.findOne({ userId: userId }).populate(
      "userId"
    );
    if (!profiles || profiles.length === 0)
      return ResponseConstant.notFound(res);

    return ResponseConstant.success(
      res,
      `Profiles ${ResponseMessage.FETCHED}`,
      profiles
    );
  } catch (err) {
    return ResponseConstant.serverError(res, err);
  }
};

const getProfileById = async (req, res) => {
  const { _id } = req.params;
  console.log(_id);

  const id = ValidationHelper.notFoundId(res, _id);
  if (!id) return;

  try {
    const profile = await Profile.findOne({ userId: _id }).populate("userId");
    console.log(profile);

    if (!profile) return ResponseConstant.notFound(res);

    return ResponseConstant.success(
      res,
      `Profile ${ResponseMessage.FETCHED}`,
      profile
    );
  } catch (err) {
    return ResponseConstant.serverError(res, err);
  }
};

export default {
  addOrUpdateProfile,
  updateCvOrImage,
  getProfile,
  getProfileById,
  updateVideoUrl,
};
