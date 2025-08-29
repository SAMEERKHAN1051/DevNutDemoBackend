import mongoose from "mongoose";
import Review from "../models/reviewmodel.js";
import Restaurant from "../models/restaurantmodel.js";
import Dish from "../models/dishmodel.js";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import ValidationHelper from "../helper/validationHelper.js";
import validation from "../service/validation.service.js";
import { getParamId, getUserId } from "../utlis/utilities.js";

const addReview = async (req, res) => {
  try {
    const id = getUserId(req);
    const { error } = validation.validateReview(req.body);
    if (error) return ValidationHelper.validation(res, error);
    const { restaurantId, dishId, rating, comment, orderId } = req.body;

    const review = new Review({
      customerId: id,
      restaurantId,
      dishId,
      rating,
      comment,
      orderId,
    });

    await review.save();
    await updateAggregates(review.restaurantId, review.dishId);

    return ResponseConstant.created(res, review, ResponseMessage.REVIEW_ADDED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const updateReview = async (req, res) => {
  try {
    const id = getUserId(req);
    const review = await Review.findById(getParamId(req));
    if (!review) {
      return ResponseConstant.notFound(
        res,
        null,
        ResponseMessage.REVIEW_NOT_FOUND
      );
    }

    const { error } = validation.validateReview(req.body);
    if (error) return ValidationHelper.validation(res, error);

    if (review.customerId.toString() !== id) {
      return ResponseConstant.forbidden(res, ResponseMessage.FORBIDDEN);
    }

    // allow updating only safe fields
    const { rating, comment, visible } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (visible !== undefined) review.visible = visible;

    await review.save();
    await updateAggregates(review.restaurantId, review.dishId);

    return ResponseConstant.success(
      res,
      review,
      ResponseMessage.REVIEW_UPDATED
    );
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    const id = getUserId(req);
    const review = await Review.findById(getParamId(req));
    if (!review) {
      return ResponseConstant.notFound(
        res,
        null,
        ResponseMessage.REVIEW_NOT_FOUND
      );
    }

    if (review.customerId.toString() !== id) {
      return ResponseConstant.forbidden(res, ResponseMessage.FORBIDDEN);
    }

    review.visible = false;
    await review.save();
    await updateAggregates(review.restaurantId, review.dishId);

    return ResponseConstant.success(
      res,
      review,
      ResponseMessage.REVIEW_DELETED
    );
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const getReviewsByRestaurant = async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurantId: req.params.restaurantId,
      visible: true,
    })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    return ResponseConstant.success(res, reviews, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const getReviewsByDish = async (req, res) => {
  try {
    const reviews = await Review.find({
      dishId: req.params.dishId,
      visible: true,
    })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    return ResponseConstant.success(res, reviews, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const updateAggregates = async (restaurantId, dishId) => {
  if (restaurantId) {
    const agg = await Review.aggregate([
      {
        $match: {
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          visible: true,
        },
      },
      {
        $group: {
          _id: "$restaurantId",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (agg.length) {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        ratingAvg: agg[0].avg,
        ratingCount: agg[0].count,
      });
    } else {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        ratingAvg: 0,
        ratingCount: 0,
      });
    }
  }

  if (dishId) {
    const agg = await Review.aggregate([
      {
        $match: { dishId: new mongoose.Types.ObjectId(dishId), visible: true },
      },
      {
        $group: {
          _id: "$dishId",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (agg.length) {
      await Dish.findByIdAndUpdate(dishId, {
        ratingAvg: agg[0].avg,
        ratingCount: agg[0].count,
      });
    } else {
      await Dish.findByIdAndUpdate(dishId, {
        ratingAvg: 0,
        ratingCount: 0,
      });
    }
  }
};

export default {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByRestaurant,
  getReviewsByDish,
  updateAggregates,
};
