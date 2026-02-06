const jwt = require("jsonwebtoken");

const generateToken = (id, role, username, full_name) => {
  return jwt.sign({ id, role, username, full_name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = generateToken;
