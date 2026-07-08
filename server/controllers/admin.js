// File: server/controllers/admin.js
const adminService = require('../services/admin');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

const addUser = async (req, res, next) => {
  try {
    const user = await adminService.addUser(req.body);
    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const addStore = async (req, res, next) => {
  try {
    const store = await adminService.addStore(req.body);
    res.status(201).json({
      status: 'success',
      data: store,
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getUsers(req.query);
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

const getStores = async (req, res, next) => {
  try {
    const stores = await adminService.getStores(req.query);
    res.status(200).json({
      status: 'success',
      data: stores,
    });
  } catch (err) {
    next(err);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await adminService.getUserDetails(userId);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getStores,
  getUserDetails,
};
