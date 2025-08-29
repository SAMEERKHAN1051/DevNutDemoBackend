const ResponseMessage = {
  // General
  NOT_FOUND: "Not found",
  ALREADY_EXISTS: "Already exists",
  SUCCESS: "Operation successful",
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  FETCHED: "Fetched successfully",
  DELETED: "Deleted successfully",
  FORBIDDEN: "Access denied",
  FIELD_REQUIRED: "Field is required",
  SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",

  // Auth
  LOGIN_SUCCESS: "Logged in successfully",
  LOGOUT_SUCCESS: "Logged out successfully",
  SIGNUP_SUCCESS: "Account created successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_TOKEN: "Invalid token",
  EXPIRED_TOKEN: "Token has expired",
  RESET_LINK_SENT: "Password reset link sent successfully",
  EMAIL_SENT: "Email sent successfully",
  VERIFICATION_SUCCESS: "Verification successful",
  VERIFICATION_FAILED: "Verification failed",

  // Users
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_NOT_FOUND: "User not found",
  PROFILE_UPDATED: "Profile updated successfully",

  // Restaurant
  RESTAURANT_CREATED: "Restaurant created successfully",
  RESTAURANT_UPDATED: "Restaurant updated successfully",
  RESTAURANT_DELETED: "Restaurant deleted successfully",
  RESTAURANT_NOT_FOUND: "Restaurant not found",

  // Category
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_DELETED: "Category deleted successfully",
  CATEGORY_NOT_FOUND: "Category not found",

  // Dish
  DISH_CREATED: "Dish created successfully",
  DISH_UPDATED: "Dish updated successfully",
  DISH_DELETED: "Dish deleted successfully",
  DISH_NOT_FOUND: "Dish not found",

  // Cart
  CART_UPDATED: "Cart updated successfully",
  CART_CLEARED: "Cart cleared successfully",
  CART_NOT_FOUND: "Cart not found",

  // Order
  ORDER_PLACED: "Order placed successfully",
  ORDER_UPDATED: "Order updated successfully",
  ORDER_DELETED: "Order deleted successfully",
  ORDER_NOT_FOUND: "Order not found",

  // Review
  REVIEW_ADDED: "Review added successfully",
  REVIEW_UPDATED: "Review updated successfully",
  REVIEW_DELETED: "Review deleted successfully",
  REVIEW_NOT_FOUND: "Review not found",
};

export default ResponseMessage;
