import cloudinary from "../config/cloudinary.js";
import admin from "../config/firebase.js";
import ResponseHelper from "../helper/helper.js";
import ResponseConstant from "../helper/helperConstant.js";
import User from "../models/authmodel.js";
import Media from "../models/mediamodel.js";

// 🔔 Send Push Notification to one user
const checkNotification = async (req, res) => {
  const { userId, title, body } = req.body;

  if (!userId || !title || !body) {
    return ResponseConstant.badRequest(res, "Missing required fields");
  }

  try {
    const user = await User.findById(userId);

    if (!user || !user.deviceToken) {
      return ResponseConstant.badRequest(res, "User or device token not found");
    }

    // Await the notification sending to ensure response returns properly
    await ResponseHelper.sendNotification(res, user.deviceToken, title, body);
  } catch (err) {
    console.error("Check Notification Error:", err);
    return ResponseConstant.error(res, "Something went wrong", err);
  }
};

// const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return ResponseConstant.badRequest(res, "File not uploaded");
//     }

//     const fileUrl = `/uploads/${req.file.filename}`;

//     const media = await Media.create({
//       fileName: req.file.originalname,
//       path: fileUrl,
//     });

//     return ResponseConstant.success(res, "File uploaded successfully", {
//       id: media._id,
//       fileName: media.fileName,
//       path: media.path,
//       mimeType: req.file.mimetype,
//       size: req.file.size,
//     });
//   } catch (error) {
//     return ResponseConstant.serverError(res, error);
//   }

const uploadFile = async (req, res) => {
  try {
    // Check if a file is attached
    if (!req.file || !req.file.path) {
      return ResponseConstant.badRequest(res, "No file uploaded");
    }

    const media = await Media.create({
      url: req.file.path,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      publicId: req.file.filename,
    });

    await media.save();
    return ResponseConstant.success(res, "File uploaded successfully", {
      url: req.file.path,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      publicId: req.file.filename,
    });
  } catch (error) {
    return ResponseConstant.serverError(res, error.message);
  }
};

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos",
    });

    // Save Cloudinary result to DB
    const media = await Media.create({
      url: result.secure_url,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      publicId: result.public_id,
    });

    return ResponseConstant.success(res, "File uploaded successfully", {
      url: result.secure_url,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading video", error });
  }
};

export default { checkNotification, uploadFile, uploadVideo };
