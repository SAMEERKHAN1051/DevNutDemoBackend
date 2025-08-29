import jwt from "jsonwebtoken";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import Roles from "../enum/role.js";

const protect = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return ResponseConstant.unauthorized(res, null);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return ResponseConstant.unauthorized(res, null);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === Roles.ADMIN) {
    return next();
  }
  return ResponseConstant.forbidden(
    res,
    `${ResponseMessage.FORBIDDEN} Admins only.`
  );
};

const isUser = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === Roles.CUSTOMER || req.user.role === Roles.OWNER)
  ) {
    return next();
  }
  return ResponseConstant.forbidden(
    res,
    `${ResponseMessage.FORBIDDEN} Users only.`
  );
};

export { protect, isAdmin, isUser };
