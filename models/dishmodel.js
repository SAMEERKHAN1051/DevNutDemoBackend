import mongoose from "mongoose";

const DishSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: String,
    imageUrl: String,
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Fast Food", "Chinese", "Pizza", "Desserts", "Drinks", "Other"],
      required: true,
    },
    isAvailable: { type: Boolean, default: true, index: true },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DishSchema.index({ name: "text", description: "text" });

export default mongoose.model("Dish", DishSchema);
