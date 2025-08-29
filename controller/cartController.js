import Cart from "../models/cartmodel.js";
import Dish from "../models/dishmodel.js";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import {getParamId ,getUserId } from "../utlis/utilities.js";

export const getCart = async (req, res) => {
  const id = getUserId(req);
  try {
    const cart = await Cart.findOne({ customerId: id })
      .populate("items.dishId", "name price")
      .populate("restaurantId", "name");

    if (!cart) return ResponseConstant.notFound(res, null, "Cart not found");

    return ResponseConstant.success(res, cart, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const id = getUserId(req);
    const { dishId, qty, restaurantId } = req.body;

    const dish = await Dish.findById(dishId);
    if (!dish) return ResponseConstant.notFound(res, null, "Dish not found");

    let cart = await Cart.findOne({ customerId: id });

    if (!cart) {
      cart = new Cart({
        customerId: id,
        restaurantId,
        items: [{ dishId, qty }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.dishId.toString() === dishId
      );

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.items.push({ dishId, qty });
      }

      // Ensure restaurant consistency
      if (cart.restaurantId.toString() !== restaurantId) {
        return ResponseConstant.badRequest(
          res,
          "Cart already has items from another restaurant"
        );
      }
    }

    await cart.save();
    return ResponseConstant.success(res, cart, ResponseMessage.UPDATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const id = getUserId(req);
    const { dishId } = req.params;

    const cart = await Cart.findOne({ customerId: id });
    if (!cart) return ResponseConstant.notFound(res, null, "Cart not found");

    cart.items = cart.items.filter((item) => item.dishId.toString() !== dishId);

    await cart.save();
    return ResponseConstant.success(res, cart, ResponseMessage.UPDATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const clearCart = async (req, res) => {
  try {
    const id = getUserId(req);
    const cart = await Cart.findOne({ customerId: id });
    if (!cart) return ResponseConstant.notFound(res, null, "Cart not found");

    cart.items = [];
    await cart.save();

    return ResponseConstant.success(res, cart, "Cart cleared");
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};
