import { capitalizeFirstLetter } from "../utlis/utilities.js";
import ResponseHelper from "./helper.js";

class ResponseConstant {
  static success(res, message, data = null) {
    return ResponseHelper.response(
      res,
      capitalizeFirstLetter(message),
      200,
      data
    );
  }

  static created(res, message = "Success", data = null) {
    return ResponseHelper.response(
      res,
      capitalizeFirstLetter(message),
      201,
      data
    );
  }

  static badRequest(res, message, data = null) {
    return ResponseHelper.response(
      res,
      capitalizeFirstLetter(message),
      400,
      data
    );
  }

  static unauthorized(res, data = null) {
    return ResponseHelper.response(res, "Unauthorized", 401, data);
  }
  static forbidden(res, message, data = null) {
    return ResponseHelper.response(
      res,
      capitalizeFirstLetter(message),
      403,
      data
    );
  }

  static notFound(res, data = null) {
    return ResponseHelper.response(res, "Not Found", 404, data);
  }

  static serverError(res, error, data = null) {
    return ResponseHelper.response(res, error, 500, data);
  }
}

export default ResponseConstant;
