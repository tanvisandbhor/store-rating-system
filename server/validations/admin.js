// File: server/validations/admin.js
const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');

const validateAddUser = (req, res, next) => {
  const { name, email, password, address, role } = req.body;

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

  const validRoles = ['ADMIN', 'USER', 'OWNER'];
  if (!role || !validRoles.includes(role)) {
    return next(new ApiError(400, `Role must be one of: ${validRoles.join(', ')}`));
  }

  next();
};

const validateAddStore = async (req, res, next) => {
  const { name, email, address, ownerId } = req.body;

  if (!name || typeof name !== 'string') {
    return next(new ApiError(400, 'Store name is required.'));
  }
  if (!email || typeof email !== 'string') {
    return next(new ApiError(400, 'Store email is required.'));
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ApiError(400, 'Invalid store email format.'));
  }

  if (!address || typeof address !== 'string') {
    return next(new ApiError(400, 'Store address is required.'));
  }
  if (address.length > 400) {
    return next(new ApiError(400, 'Store address must not exceed 400 characters.'));
  }

  if (ownerId !== undefined && ownerId !== null) {
    const ownerIdInt = parseInt(ownerId, 10);
    if (isNaN(ownerIdInt)) {
      return next(new ApiError(400, 'Owner ID must be a valid integer.'));
    }

    // Verify user exists and has role OWNER
    const owner = await prisma.user.findUnique({
      where: { id: ownerIdInt },
    });

    if (!owner) {
      return next(new ApiError(400, 'Assigned Store Owner does not exist.'));
    }
    if (owner.role !== 'OWNER') {
      return next(new ApiError(400, 'Assigned user must have the OWNER role.'));
    }

    // Verify owner is not already assigned to another store
    const existingStore = await prisma.store.findUnique({
      where: { ownerId: ownerIdInt },
    });
    if (existingStore) {
      return next(new ApiError(400, 'Assigned Store Owner already owns another store.'));
    }
    req.body.ownerId = ownerIdInt; // Ensure parsed int is set
  }

  next();
};

module.exports = {
  validateAddUser,
  validateAddStore,
};
