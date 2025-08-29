import Order from "../models/ordermodel.js";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import mongoose from "mongoose";
import validation from "../service/validation.service.js";
import ValidationHelper from "../helper/validationHelper.js";
import { getParamId, getUserId } from "../utlis/utilities.js";

const addStatusHistory = (order, status, byRole) => {
  order.statusHistory.push({ status, byRole });
  order.status = status;
};

const createOrder = async (req, res) => {
  const id = getUserId(req);
  const { error } = validation.validateOrder(req.body);
  if (error) return ValidationHelper.validation(res, error);
  try {
    const {
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      payment,
      deliveryAddress,
      restaurantId,
    } = req.body;

    if (!items || items.length === 0) {
      return ResponseConstant.badRequest(
        res,
        "Order must include at least one item"
      );
    }

    const orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      orderCode,
      customerId: id,
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      payment,
      deliveryAddress,
      statusHistory: [{ status: "placed", byRole: "customer" }],
    });

    await order.save();
    return ResponseConstant.created(res, order, ResponseMessage.CREATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const filter = {};

    if (role === "customer") filter.customerId = userId;
    if (role === "owner") filter.restaurantId = req.query.restaurantId;
    if (role === "rider") filter.riderId = userId;

    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return ResponseConstant.success(res, orders, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(getParamId(req))
      .populate("customerId", "name email")
      .populate("restaurantId", "name")
      .populate("riderId", "name");

    if (!order) return ResponseConstant.notFound(res, null, "Order not found");
    return ResponseConstant.success(res, order, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const updateOrderStatus = async (req, res) => {
  const { error } = validation.validateOrderStatus(req.body);
  if (error) return ValidationHelper.validation(res, error);
  try {
    const { status } = req.body;
    const order = await Order.findById(getParamId(req));
    if (!order) return ResponseConstant.notFound(res, null, "Order not found");

    addStatusHistory(order, status, req.user.role);

    if (status === "delivered") order.deliveredAt = new Date();
    if (status === "on_the_way") order.assignedAt = new Date();

    await order.save();
    return ResponseConstant.success(res, order, ResponseMessage.UPDATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(riderId)) {
      return ResponseConstant.badRequest(res, "Invalid riderId");
    }

    const order = await Order.findById(getParamId(req));
    if (!order) return ResponseConstant.notFound(res, null, "Order not found");

    order.riderId = riderId;
    order.assignedAt = new Date();
    addStatusHistory(order, "on_the_way", "owner");

    await order.save();
    return ResponseConstant.success(res, order, ResponseMessage.UPDATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const id = getUserId(req);
    const order = await Order.findById(getParamId(req));
    if (!order) return ResponseConstant.notFound(res, null, "Order not found");

    if (order.customerId.toString() !== id) {
      return ResponseConstant.forbidden(
        res,
        "You can only cancel your own orders"
      );
    }

    addStatusHistory(order, "cancelled", "customer");
    await order.save();

    return ResponseConstant.success(res, order, ResponseMessage.UPDATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(getParamId(req)).select(
      "status statusHistory riderLocation"
    );
    if (!order) return ResponseConstant.notFound(res, null, "Order not found");

    return ResponseConstant.success(res, order, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export default {
  addStatusHistory,
  assignRider,
  cancelOrder,
  createOrder,
  getOrders,
  trackOrder,
  updateOrderStatus,
  getOrderById,
};
