import mongoose from "mongoose";

const RiderSchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      enum: ["bike", "car", "bicycle", "scooter"],
      default: "bike",
    },
    vehicleNumber: String,
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    text: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: undefined }, // [lng, lat]
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    phone: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "owner", "rider", "admin"],
      required: true,
      index: true,
    },
    avatarUrl: String,
    addresses: [AddressSchema],
    rider: RiderSchema, // only for role=rider
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      index: true,
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

UserSchema.index({ role: 1, status: 1 });

export default mongoose.model("User", UserSchema);
