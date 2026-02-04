const { param, body, query } = require("express-validator");
const ValidationMiddleWare = require("../../Middlewares/ValidationMiddleware");

exports.getAllCoursesValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive number"),
  query("search")
    .optional()
    .isString()
    .withMessage("Search term must be a string"),
  ValidationMiddleWare,
];

exports.getCourseByIdValidator = [
  param("id").isInt().withMessage("Course ID must be a number"),
  ValidationMiddleWare,
];

exports.createCourseValidator = [
  body("instructor_id")
    .notEmpty()
    .withMessage("Instructor ID is required")
    .isInt()
    .withMessage("Instructor ID must be a number")
    .toInt(),
  body("category_id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be a number")
    .toInt(),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("subtitle")
    .notEmpty()
    .withMessage("Subtitle is required")
    .isString()
    .withMessage("Subtitle must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Subtitle must be between 3 and 200 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),
  body("level")
    .notEmpty()
    .withMessage("Level is required")
    .isString()
    .withMessage("Level must be a string")
    .isIn(["beginner", "intermediate", "expert"])
    .withMessage("Level must be one of: beginner, intermediate, expert"),
  body("thumbnail_url")
    .notEmpty()
    .withMessage("Thumbnail URL is required")
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),
  body("language")
    .notEmpty()
    .withMessage("Language is required")
    .isString()
    .withMessage("Language must be a string"),
  body("is_published")
    .optional()
    .isBoolean()
    .withMessage("is_published must be a boolean")
    .toBoolean(),
  ValidationMiddleWare,
];

exports.updateCourseValidator = [
  param("id").isInt().withMessage("Course ID must be a number"),
  body("instructor_id")
    .optional()
    .isInt()
    .withMessage("Instructor ID must be a number")
    .toInt(),
  body("category_id")
    .optional()
    .isInt()
    .withMessage("Category ID must be a number")
    .toInt(),
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("subtitle")
    .optional()
    .isString()
    .withMessage("Subtitle must be a string")
    .isLength({ min: 3, max: 200 })
    .withMessage("Subtitle must be between 3 and 200 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),
  body("level")
    .optional()
    .isString()
    .withMessage("Level must be a string")
    .isIn(["beginner", "intermediate", "expert"])
    .withMessage("Level must be one of: beginner, intermediate, expert"),
  body("thumbnail_url")
    .optional()
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL"),
  body("language")
    .optional()
    .isString()
    .withMessage("Language must be a string"),
  body("is_published")
    .optional()
    .isBoolean()
    .withMessage("is_published must be a boolean")
    .toBoolean(),
  ValidationMiddleWare,
];

exports.deleteCourseValidator = [
  param("id").isInt().withMessage("Course ID must be a number"),
  ValidationMiddleWare,
];
