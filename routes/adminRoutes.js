import express from "express";
import { protect, isAdmin } from "../middleware/auth.js";
import userController from "../controller/authController.js";
import restaurantController from "../controller/restaurantController.js";
import dishController from "../controller/dishController.js";
import orderController from "../controller/orderController.js";
import reviewController from "../controller/reviewController.js";

const router = express.Router();

router.use(protect, isAdmin);

// User management
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id/status", userController.updateUserStatus);
router.delete("/users/:id", userController.deleteUser);

// Restaurant management
router.get("/restaurants", restaurantController.getRestaurants);
router.get("/restaurants/:id", restaurantController.getRestaurantById);
router.put("/restaurants/:id/approve", restaurantController.approveRestaurant);
router.put(
  "/restaurants/:id/toggle-open",
  restaurantController.toggleOpenStatus
);
router.delete("/restaurants/:id", restaurantController.deleteRestaurant);

// Dish management
router.get("/dishes", dishController.getDishes);
router.get("/dishes/:id", dishController.getDishById);
router.put(
  "/dishes/:id/toggle-availability",
  dishController.toggleDishAvailability
);
router.delete("/dishes/:id", dishController.deleteDish);

// Order management
router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id/status", orderController.updateOrderStatus);
router.put("/orders/:id/assign-rider", orderController.assignRider);
router.delete("/orders/:id", orderController.cancelOrder);

// Review management
router.get("/reviews", reviewController.getAllReviews);
router.get("/reviews/:id", reviewController.getReviewById);
router.delete("/reviews/:id", reviewController.deleteReview);

export default router;
