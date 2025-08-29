import Dish from "../models/dishmodel.js";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import validation from "../service/validation.service.js";
import ValidationHelper from "../helper/validationHelper.js";

const createDish = async (req, res) => {
  const { error } = validation.validateDish(req.body);
  if (error) return ValidationHelper.validation(res, error);

  try {
    const { restaurantId, name, description, imageUrl, price, category } =
      req.body;

    const dish = new Dish({
      restaurantId,
      name,
      description,
      imageUrl,
      price,
      category,
    });

    await dish.save();
    return ResponseConstant.created(res, dish, ResponseMessage.CREATED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const getDishes = async (req, res) => {
  try {
    const filters = {};
    if (req.query.restaurantId) filters.restaurantId = req.query.restaurantId;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.isAvailable !== undefined)
      filters.isAvailable = req.query.isAvailable === "true";

    const dishes = await Dish.find(filters).sort({ createdAt: -1 });
    return ResponseConstant.success(res, dishes, ResponseMessage.FETCHED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(getParamId(req));
    if (!dish)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);

    return ResponseConstant.success(res, dish, ResponseMessage.FETCHED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const updateDish = async (req, res) => {
  const { error } = validation.validateDish(req.body);
  if (error) return ValidationHelper.validation(res, error);

  try {
    const dish = await Dish.findByIdAndUpdate(getParamId(req), req.body, {
      new: true,
      runValidators: true,
    });

    if (!dish)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);
    return ResponseConstant.success(res, dish, ResponseMessage.UPDATED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(getParamId(req));
    if (!dish)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);

    return ResponseConstant.success(res, null, ResponseMessage.DELETED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const searchDishes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return ResponseConstant.badRequest(res, "Search query is required");
    }

    const dishes = await Dish.find({ $text: { $search: q } });
    return ResponseConstant.success(res, dishes, ResponseMessage.FETCHED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const toggleDishAvailability = async (req, res) => {
  try {
    const dish = await Dish.findById(getParamId(req));
    if (!dish)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);

    dish.isAvailable = !dish.isAvailable;
    await dish.save();

    return ResponseConstant.success(res, dish, ResponseMessage.UPDATED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

export default {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getDishes,
  searchDishes,
  toggleDishAvailability,
};
