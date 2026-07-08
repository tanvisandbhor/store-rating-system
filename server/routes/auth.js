// File: server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authValidation = require('../validations/auth');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/signup', authValidation.validateSignup, authController.signup);
router.post('/login', authValidation.validateLogin, authController.login);

// Private routes
router.put('/change-password', verifyToken, authValidation.validateChangePassword, authController.changePassword);

module.exports = router;
