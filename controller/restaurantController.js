import Restaurant from "../models/restaurantmodel.js";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import ValidationHelper from "../helper/validationHelper.js";
import validation from "../service/validation.service.js";
import { getParamId, getUserId } from "../utlis/utilities.js";

const createRestaurant = async (req, res) => {
  const { error } = validation.validateRestaurant(req.body);
  if (error) return ValidationHelper.validation(res, error);
  try {
    const id = getUserId(req);
    const {
      name,
      logo,
      bannerUrl,
      description,
      address,
      location,
      categories,
      hours,
    } = req.body;

    const restaurant = new Restaurant({
      ownerId: id,
      name,
      logo,
      bannerUrl,
      description,
      address,
      location,
      categories,
      hours,
    });

    await restaurant.save();
    return ResponseConstant.created(res, restaurant, ResponseMessage.CREATED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const updateRestaurant = async (req, res) => {
  const { error } = validation.validateRestaurant(req.body);
  if (error) return ValidationHelper.validation(res, error);
  try {
    const id = getUserId(req);
    const restaurant = await Restaurant.findById(getParamId(req));
    if (!restaurant)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);

    if (restaurant.ownerId.toString() !== id) {
      return ResponseConstant.forbidden(res, ResponseMessage.FORBIDDEN);
    }

    Object.assign(restaurant, req.body);
    await restaurant.save();

    return ResponseConstant.success(res, restaurant, ResponseMessage.UPDATED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(getParamId(req));
    if (!restaurant)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);

    restaurant.approved = !!req.body.approved;
    await restaurant.save();

    return ResponseConstant.success(res, restaurant, ResponseMessage.UPDATED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const toggleOpenStatus = async (req, res) => {
  try {
    const id = getUserId(req);
    const restaurant = await Restaurant.findById(getParamId(req));
    if (!restaurant)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);

    if (restaurant.ownerId.toString() !== id) {
      return ResponseConstant.forbidden(res, ResponseMessage.FORBIDDEN);
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    return ResponseConstant.success(res, restaurant, ResponseMessage.UPDATED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const getRestaurants = async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) filter.categories = req.query.categoryId;
    if (req.query.approved !== undefined)
      filter.approved = req.query.approved === "true";
    if (req.query.open !== undefined) filter.isOpen = req.query.open === "true";

    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
    return ResponseConstant.success(res, restaurants, ResponseMessage.FETCHED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(getParamId(req)).populate(
      "categories",
      "name slug"
    );
    if (!restaurant)
      return ResponseConstant.notFound(res, null, ResponseMessage.NOT_FOUND);

    return ResponseConstant.success(res, restaurant, ResponseMessage.FETCHED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

const searchRestaurants = async (req, res) => {
  try {
    const { q, lng, lat, radius } = req.query;

    const filter = { approved: true };
    if (q) filter.$text = { $search: q };

    let restaurants;

    if (lng && lat && radius) {
      restaurants = await Restaurant.find({
        ...filter,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: parseInt(radius, 10),
          },
        },
      });
    } else {
      restaurants = await Restaurant.find(filter);
    }

    return ResponseConstant.success(res, restaurants, ResponseMessage.FETCHED);
  } catch (err) {
    return ResponseConstant.error(res, err.message);
  }
};

export default {
  createRestaurant,
  updateRestaurant,
  approveRestaurant,
  searchRestaurants,
  toggleOpenStatus,
  getRestaurants,
  getRestaurantById,
};
