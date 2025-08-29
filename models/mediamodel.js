import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  mimetype: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Media", MediaSchema);
