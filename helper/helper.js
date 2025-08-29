import admin from "../config/firebase.js";
import ResponseConstant from "./helperConstant.js";

class ResponseHelper {
  static response(res, message, statusCode = 200, data = null) {
    const success = statusCode >= 200 && statusCode < 300;
    res.status(statusCode).json({
      success: success,
      statusCode,
      message: [message],
      data,
    });
  }

  static async sendNotification(res, deviceToken, title, body) {
    if (!deviceToken) {
      return ResponseConstant.badRequest(res, "Device token not provided");
    }

    const message = {
      token: deviceToken,
      notification: {
        title: title || "No Title",
        body: body || "No Body",
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
    };

    try {
       await admin.messaging().send(message);
      // return ResponseConstant.success(res, "Notification sent successfully", {
      //   messageId: response,
      // });
    } catch (error) {
      console.error("FCM Error:", error);
      return ResponseConstant.serverError(
        res,
        "Failed to send notification",
        error?.message || error
      );
    }
  }
}

export default ResponseHelper;
