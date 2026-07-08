// File: server/routes/owner.js
const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner');
const { verifyToken, restrictTo } = require('../middleware/auth');

// Protected, Owner only
router.use(verifyToken);
router.use(restrictTo('OWNER'));

router.get('/dashboard', ownerController.getOwnerDashboard);

module.exports = router;
