const { validationResult } = require("express-validator");

/**
 * Middleware to handle validation results using express-validator.
 * Checks for validation errors in the request. If errors exist, responds with 400.
 * Otherwise, passes control to the next middleware.
 */
const ValidationMiddleWare = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
module.exports = ValidationMiddleWare;
