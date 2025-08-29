import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    qty: { type: Number, min: 1, required: true },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
