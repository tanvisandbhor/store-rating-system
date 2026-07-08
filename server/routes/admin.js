// File: server/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const adminValidation = require('../validations/admin');
const { verifyToken, restrictTo } = require('../middleware/auth');

// Protect all routes under this router - Admin only
router.use(verifyToken);
router.use(restrictTo('ADMIN'));

// Admin Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Add users & stores
router.post('/users', adminValidation.validateAddUser, adminController.addUser);
router.post('/stores', adminValidation.validateAddStore, adminController.addStore);

// Listings
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.get('/stores', adminController.getStores);

module.exports = router;
