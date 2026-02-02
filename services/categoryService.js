//service/categoryService.js
const categoryModel = require("../models/categoryModel.js");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiErrorHandler.js");

//GET ALL CATEGORIES
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await categoryModel.getAllCategories(skip, limit);
  if (!categories) {
    next(new ApiError("Categories not found", 404))
  }
  res.status(200).json({
    success: true,
    page: page,
    limit: limit,
    data: categories,
  });
});

//GET SINGLE CATEGORY
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.getCategoryById(id);
  if (!category) {
    return next( new ApiError("Category not found", 404))
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

//CREATE CATEGORY
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const newCategory = await categoryModel.createCategory(name, description);
  if (!newCategory) {
    return next(new ApiError("Category not created" ,404))
  }
  res.status(201).json({
    success: true,
    data: newCategory,
  });
});

//update category
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updatedCategory = await categoryModel.updateCategory(
    id,
    name,
    description,
  );
  if (!updatedCategory) {
    return next(new ApiError("Category not updated" ,404))
  }
  res.status(200).json({
    success: true,
    data: updatedCategory,
  });
});

//delete category
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedCategory = await categoryModel.deleteCategory(id);
  if (!deletedCategory) {
   return next(new ApiError("Category not deleted" ,404))
  }
  res.status(200).json({
    success: true,
    data: deletedCategory,
  });
});
