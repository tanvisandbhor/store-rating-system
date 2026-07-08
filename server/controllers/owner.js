// File: server/controllers/owner.js
const ownerService = require('../services/owner');

const getOwnerDashboard = async (req, res, next) => {
  try {
    const dashboard = await ownerService.getOwnerDashboard(req.user.id, req.query);
    res.status(200).json({
      status: 'success',
      data: dashboard,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOwnerDashboard,
};
