// File: server/routes/ratings.js
const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratings');
const ratingValidation = require('../validations/rating');
const { verifyToken, restrictTo } = require('../middleware/auth');

// Protected, User only
router.use(verifyToken);
router.use(restrictTo('USER'));

router.post('/', ratingValidation.validateSubmitRating, ratingsController.submitRating);

module.exports = router;
