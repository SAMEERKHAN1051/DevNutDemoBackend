import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "preparing",
        "ready",
        "on_the_way",
        "delivered",
        "rejected",
        "cancelled",
      ],
      required: true,
    },
    at: { type: Date, default: Date.now },
    byRole: { type: String, enum: ["customer", "owner", "rider", "admin"] },
  },
  { _id: false }
);

const GeoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined }, // [lng, lat]
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, unique: true, index: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    items: { type: [OrderItemSchema], validate: (v) => v.length > 0 },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    serviceFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    payment: {
      method: { type: String, enum: ["cod", "card"], required: true },
      status: {
        type: String,
        enum: ["unpaid", "paid", "refunded"],
        default: "unpaid",
      },
      intentId: String,
    },
    deliveryAddress: {
      text: String,
      location: GeoPointSchema,
    },
    restaurantLocation: GeoPointSchema,
    riderLocation: GeoPointSchema,
    status: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "preparing",
        "ready",
        "on_the_way",
        "delivered",
        "rejected",
        "cancelled",
      ],
      default: "placed",
      index: true,
    },
    statusHistory: [StatusHistorySchema],
    assignedAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, restaurantId: 1 });

export default mongoose.model("Order", OrderSchema);
