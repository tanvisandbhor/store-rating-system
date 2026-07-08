// File: server/routes/stores.js
const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores');
const { verifyToken } = require('../middleware/auth');

// Protected routes
router.use(verifyToken);

router.get('/', storesController.getStoresForUser);

module.exports = router;
