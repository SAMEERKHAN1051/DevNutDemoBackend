import Category from "../models/categorymodel.js";
import ResponseConstant from "../helper/helperConstant.js";
import ResponseMessage from "../enum/response_message.js";
import validation from "../service/validation.service.js";
import ValidationHelper from "../helper/validationHelper.js";

export const createCategory = async (req, res) => {
  const { error } = validation.validateCategory(req.body);
  if (error) return ValidationHelper.validation(res, error);
  try {
    const { name, slug, icon } = req.body;

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return ResponseConstant.badRequest(res, "Category already exists");
    }

    const category = new Category({ name, slug, icon });
    await category.save();

    return ResponseConstant.created(res, category, ResponseMessage.CREATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return ResponseConstant.success(res, categories, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(getParamId(req));
    if (!category)
      return ResponseConstant.notFound(res, null, "Category not found");

    return ResponseConstant.success(res, category, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const updateCategory = async (req, res) => {
  const { error } = validation.validateCategory(req.body);
  if (error) return ValidationHelper.validation(res, error);
  try {
    const { name, slug, icon, active } = req.body;
    const category = await Category.findByIdAndUpdate(
      getParamId(req),
      { name, slug, icon, active },
      { new: true, runValidators: true }
    );

    if (!category)
      return ResponseConstant.notFound(res, null, "Category not found");
    return ResponseConstant.success(res, category, ResponseMessage.UPDATED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(getParamId(req));
    if (!category)
      return ResponseConstant.notFound(res, null, "Category not found");

    return ResponseConstant.success(res, null, ResponseMessage.DELETED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};

export const searchCategories = async (req, res) => {
  try {
    const { q } = req.query;
    const categories = await Category.find({ $text: { $search: q } });

    return ResponseConstant.success(res, categories, ResponseMessage.FETCHED);
  } catch (error) {
    return ResponseConstant.error(res, error.message);
  }
};
