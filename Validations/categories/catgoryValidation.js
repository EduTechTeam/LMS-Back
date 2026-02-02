const { param, body } = require("express-validator");
const ValidationMiddleWare = require("../../Middlewares/ValidationMiddleware");

exports.getCategoryValidator = [
  param("id").isInt().withMessage("Category ID must be a number"),
  ValidationMiddleWare,
];

exports.createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string")
    .isLength({ max: 100, min: 3 })
    .withMessage("Category name must be at most 100 characters"),
  body("description")
    .notEmpty()
    .isString()
    .withMessage("Category description must be a string"),
  ValidationMiddleWare,
];

exports.updateCategoryValidator = [
  param("id").isInt().withMessage("Category ID must be a number"),
  body("name")
    .optional()
    .isString()
    .withMessage("Category name must be a string")
    .isLength({ max: 100, min: 3 })
    .withMessage("Category name must be at most 100 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Category description must be a string"),
  ValidationMiddleWare,
];

exports.deleteCategoryValidator = [
  param("id").isInt().withMessage("Category ID must be a number"),
  ValidationMiddleWare,
];
