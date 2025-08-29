import mongoose from "mongoose";

const HoursSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 0, max: 6 }, // 0=Sun
    open: String, // "09:00"
    close: String, // "23:00"
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const RestaurantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    logoUrl: String,
    bannerUrl: String,
    description: String,
    address: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    deliveryTimeMin: { type: Number, default: 25 },
    deliveryTimeMax: { type: Number, default: 45 },
    approved: { type: Boolean, default: false, index: true },
    isOpen: { type: Boolean, default: true },
    hours: [HoursSchema],
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0.15 }, // 15%
  },
  { timestamps: true }
);

RestaurantSchema.index({ name: "text", description: "text" });
RestaurantSchema.index({ location: "2dsphere" });

export default mongoose.model("Restaurant", RestaurantSchema);
