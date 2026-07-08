// File: server/validations/auth.js
const ApiError = require('../utils/ApiError');

const validateSignup = (req, res, next) => {
  const { name, email, address, password } = req.body;

  if (!name || typeof name !== 'string') {
    return next(new ApiError(400, 'Name is required and must be a string.'));
  }
  if (name.length < 20 || name.length > 60) {
    return next(new ApiError(400, 'Name must be between 20 and 60 characters.'));
  }

  if (!email || typeof email !== 'string') {
    return next(new ApiError(400, 'Email is required.'));
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ApiError(400, 'Invalid email format.'));
  }

  if (!address || typeof address !== 'string') {
    return next(new ApiError(400, 'Address is required.'));
  }
  if (address.length > 400) {
    return next(new ApiError(400, 'Address must not exceed 400 characters.'));
  }

  if (!password || typeof password !== 'string') {
    return next(new ApiError(400, 'Password is required.'));
  }
  if (password.length < 8 || password.length > 16) {
    return next(new ApiError(400, 'Password must be between 8 and 16 characters.'));
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasUppercase) {
    return next(new ApiError(400, 'Password must include at least one uppercase letter.'));
  }
  if (!hasSpecial) {
    return next(new ApiError(400, 'Password must include at least one special character.'));
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return next(new ApiError(400, 'Email is required.'));
  }
  if (!password || typeof password !== 'string') {
    return next(new ApiError(400, 'Password is required.'));
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || typeof oldPassword !== 'string') {
    return next(new ApiError(400, 'Old password is required.'));
  }
  if (!newPassword || typeof newPassword !== 'string') {
    return next(new ApiError(400, 'New password is required.'));
  }
  if (newPassword.length < 8 || newPassword.length > 16) {
    return next(new ApiError(400, 'New password must be between 8 and 16 characters.'));
  }
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  if (!hasUppercase) {
    return next(new ApiError(400, 'New password must include at least one uppercase letter.'));
  }
  if (!hasSpecial) {
    return next(new ApiError(400, 'New password must include at least one special character.'));
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateChangePassword,
};
