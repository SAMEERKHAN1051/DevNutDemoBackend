import express from "express";
import authController from "../controller/authController.js";
import baseController from "../controller/baseController.js";
import upload from "../middleware/multer.js";
import multer from "multer";

const router = express.Router();

const uploada = multer({ dest: "uploads/" });

router.post("/signup", authController.signup);
router.post("/notification", baseController.checkNotification);
router.post("/login", authController.login);
router.post("/social-login", authController.socialLogin);
router.post("/upload", upload.single("file"), baseController.uploadFile);
router.post(
  "/upload-video",
  uploada.single("file"),
  baseController.uploadVideo
);
router.get("/", authController.homePage);

export default router;
