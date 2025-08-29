import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      index: true,
    },
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish", index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
    visible: { type: Boolean, default: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

ReviewSchema.index({ comment: "text" });

export default mongoose.model("Review", ReviewSchema);
