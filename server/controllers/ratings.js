// File: server/controllers/ratings.js
const ratingsService = require('../services/ratings');

const submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const result = await ratingsService.submitRating(req.user.id, storeId, rating);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitRating,
};
