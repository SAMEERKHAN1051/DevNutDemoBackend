import express from "express";
import { protect } from "../middleware/auth.js";
import restaurantController from "../controller/restaurantController.js";
import dishController from "../controller/dishController.js";
import orderController from "../controller/orderController.js";
import reviewController from "../controller/reviewController.js";

const router = express.Router();

router.use(protect);
// Restaurants
router.post("/restaurants", restaurantController.createRestaurant);
router.put("/restaurants/:id", restaurantController.updateRestaurant);
router.put("/restaurants/:id/approve", restaurantController.approveRestaurant);
router.put(
  "/restaurants/:id/toggle-open",
  restaurantController.toggleOpenStatus
);
router.get("/restaurants", restaurantController.getRestaurants);
router.get("/restaurants/:id", restaurantController.getRestaurantById);
router.get("/restaurants/search", restaurantController.searchRestaurants);

// Dishes
router.post("/dishes", dishController.createDish);
router.put("/dishes/:id", dishController.updateDish);
router.delete("/dishes/:id", dishController.deleteDish);
router.get("/dishes", dishController.getDishes);
router.get("/dishes/:id", dishController.getDishById);
router.get("/dishes/search", dishController.searchDishes);
router.put(
  "/dishes/:id/toggle-availability",
  dishController.toggleDishAvailability
);

// Orders
router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id/status", orderController.updateOrderStatus);
router.put("/orders/:id/assign-rider", orderController.assignRider);
router.put("/orders/:id/cancel", orderController.cancelOrder);
router.get("/orders/:id/track", orderController.trackOrder);

// Reviews
router.post("/reviews", reviewController.addReview);
router.put("/reviews/:id", reviewController.updateReview);
router.delete("/reviews/:id", reviewController.deleteReview);
router.get(
  "/reviews/restaurant/:restaurantId",
  reviewController.getReviewsByRestaurant
);
router.get("/reviews/dish/:dishId", reviewController.getReviewsByDish);

export default router;
