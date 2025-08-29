import ResponseMessage from "../enum/response_message.js";
import { capitalizeFirstLetter } from "../utlis/utilities.js";
import ResponseConstant from "./helperConstant.js";

class ValidationHelper {
  static validation(res, error) {
    const errors = {};
    error.details.forEach((err) => {
      const field = err.path[0];
      errors[field] = err.message.replace(/["]/g, "");
    });
    return ResponseConstant.badRequest(res, errors);
  }

  static notFoundId(res, _id) {
    if (_id == null) {
      return ResponseConstant.notFound(res);
    } else {
      return _id;
    }
  }

  static async AlreadyExistException(
    res,
    model,
    fieldName,
    fieldValue,
    excludeId = null,
    message = null,
    exceptionFieldName = "_id"
  ) {
    const query = { [fieldName]: fieldValue };

    if (excludeId) {
      query[exceptionFieldName] = { $ne: excludeId }; // ✅ dynamic key fix
    }

    const existingRecord = await model.findOne(query);

    if (existingRecord) {
      return ResponseConstant.badRequest(
        res,
        message
          ? message
          : `${capitalizeFirstLetter(fieldName)} ${
              ResponseMessage.ALREADYEXIST
            }`
      );
    } else {
      return { [fieldName]: fieldValue };
    }
  }
}

export default ValidationHelper;
