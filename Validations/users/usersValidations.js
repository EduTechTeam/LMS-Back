const { param, body } = require("express-validator");
const ValidationMiddleWare = require("../../Middlewares/ValidationMiddleware");

exports.getUserValidator = [
  param("id").isInt().withMessage("User ID must be a number"),
  ValidationMiddleWare,
];

exports.createUserValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ max: 50, min: 3 })
    .withMessage("Username must be between 3 and 50 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 255 })
    .withMessage("Email must be at most 255 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").optional().isString().withMessage("Role must be a string"),
  body("headline")
    .optional()
    .isString()
    .withMessage("Headline must be a string")
    .isLength({ max: 100 })
    .withMessage("Headline must be at most 100 characters"),
  body("biography")
    .optional()
    .isString()
    .withMessage("Biography must be a string"),
  body("avatar_url")
    .optional()
    .isString()
    .withMessage("Avatar URL must be a string")
    .isLength({ max: 255 })
    .withMessage("Avatar URL must be at most 255 characters"),
  body("website_url")
    .optional()
    .isString()
    .withMessage("Website URL must be a string")
    .isLength({ max: 255 })
    .withMessage("Website URL must be at most 255 characters"),
  ValidationMiddleWare,
];

exports.updateUserValidator = [
  param("id").isInt().withMessage("User ID must be a number"),
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string")
    .isLength({ max: 50, min: 3 })
    .withMessage("Username must be between 3 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 255 })
    .withMessage("Email must be at most 255 characters"),
  body("password")
    .optional()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role").optional().isString().withMessage("Role must be a string"),
  body("headline")
    .optional()
    .isString()
    .withMessage("Headline must be a string")
    .isLength({ max: 100 })
    .withMessage("Headline must be at most 100 characters"),
  body("biography")
    .optional()
    .isString()
    .withMessage("Biography must be a string"),
  body("avatar_url")
    .optional()
    .isString()
    .withMessage("Avatar URL must be a string")
    .isLength({ max: 255 })
    .withMessage("Avatar URL must be at most 255 characters"),
  body("website_url")
    .optional()
    .isString()
    .withMessage("Website URL must be a string")
    .isLength({ max: 255 })
    .withMessage("Website URL must be at most 255 characters"),
  body("full_name")
    .optional()
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ max: 100 })
    .withMessage("Full name must be at most 100 characters"),
  ValidationMiddleWare,
];

exports.deleteUserValidator = [
  param("id").isInt().withMessage("User ID must be a number"),
  ValidationMiddleWare,
];
