import Joi from "joi";
import Roles from "../enum/role.js";
import { OrderStatus, UserStatus } from "../enum/constant.js";

const validation = {
  validateRegister: (data) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string()
        .valid(Roles.CUSTOMER, Roles.OWNER, Roles.RIDER, Roles.ADMIN)
        .default(Roles.CUSTOMER)
        .required(),
      phone: Joi.string()
        .pattern(/^[0-9]{7,15}$/)
        .required(),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateLogin: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateCategory: (data) => {
    const schema = Joi.object({
      name: Joi.string().min(2).max(50).required(),
      description: Joi.string().max(200).optional(),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateRestaurant: (data) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      logoUrl: Joi.string().uri().optional(),
      bannerUrl: Joi.string().uri().optional(),
      description: Joi.string().max(300).optional(),
      address: Joi.string().required(),
      location: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
      }).required(),
      categories: Joi.array().items(Joi.string()).min(1).required(),
      deliveryTimeMin: Joi.number().min(1).optional(),
      deliveryTimeMax: Joi.number().min(Joi.ref("deliveryTimeMin")).optional(),
      commissionRate: Joi.number().min(0).max(1).optional(),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateRestaurantHours: (data) => {
    const schema = Joi.object({
      day: Joi.number().min(0).max(6).required(), // 0=Sun
      open: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .optional(),
      close: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .optional(),
      closed: Joi.boolean().default(false),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateDish: (data) => {
    const schema = Joi.object({
      restaurantId: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().max(300).optional(),
      imageUrl: Joi.string().uri().optional(),
      price: Joi.number().min(0).required(),
      isAvailable: Joi.boolean().default(true),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateOrder: (data) => {
    const schema = Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            dishId: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
          })
        )
        .min(1)
        .required(),
      deliveryAddress: Joi.string().required(),
      paymentMethod: Joi.string()
        .valid("cod", "card")
        .default("cod")
        .required(),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateOrderStatus: (data) => {
    const schema = Joi.object({
      status: Joi.string()
        .valid(...Object.values(OrderStatus))
        .required(),
    });
    return schema.validate(data, { abortEarly: false });
  },

  validateReview: (data) => {
    const schema = Joi.object({
      restaurantId: Joi.string().optional(),
      dishId: Joi.string().optional(),
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().max(500).optional(),
      orderId: Joi.string().optional(),
    }).or("restaurantId", "dishId"); // must belong to at least one
    return schema.validate(data, { abortEarly: false });
  },

  validateUpdateProfile: (data) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).optional(),
      phone: Joi.string()
        .pattern(/^[0-9]{7,15}$/)
        .optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(),
      avatarUrl: Joi.string().uri().optional(),
    });
    return schema.validate(data, { abortEarly: false });
  },
  validateStatus: (data) => {
    const schema = Joi.object({
      status: Joi.string()
        .valid(UserStatus.ACTIVE, UserStatus.BLOCKED)
        .required(),
    });
    return schema.validate(data, { abortEarly: false });
  },
};

export default validation;
