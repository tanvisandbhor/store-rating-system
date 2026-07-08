// File: server/controllers/stores.js
const storesService = require('../services/stores');

const getStoresForUser = async (req, res, next) => {
  try {
    const stores = await storesService.getStoresForUser(req.user.id, req.query);
    res.status(200).json({
      status: 'success',
      data: stores,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStoresForUser,
};
