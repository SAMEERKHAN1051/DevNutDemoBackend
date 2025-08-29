import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ name: "text" });

export default mongoose.model("Category", CategorySchema);
