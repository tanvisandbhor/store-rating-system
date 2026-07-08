// File: server/validations/rating.js
const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');

const validateSubmitRating = async (req, res, next) => {
  const { storeId, rating } = req.body;

  if (storeId === undefined || storeId === null) {
    return next(new ApiError(400, 'Store ID is required.'));
  }
  const storeIdInt = parseInt(storeId, 10);
  if (isNaN(storeIdInt)) {
    return next(new ApiError(400, 'Store ID must be a valid integer.'));
  }

  // Verify store exists
  const store = await prisma.store.findUnique({
    where: { id: storeIdInt },
  });
  if (!store) {
    return next(new ApiError(404, 'Store not found.'));
  }
  req.body.storeId = storeIdInt; // Ensure parsed int is set

  if (rating === undefined || rating === null) {
    return next(new ApiError(400, 'Rating is required.'));
  }
  const ratingInt = parseInt(rating, 10);
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return next(new ApiError(400, 'Rating must be an integer between 1 and 5.'));
  }
  req.body.rating = ratingInt; // Ensure parsed int is set

  next();
};

module.exports = {
  validateSubmitRating,
};
