// File: server/services/admin.js
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const getDashboardStats = async () => {
  const [usersCount, storesCount, ratingsCount] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return {
    users: usersCount,
    stores: storesCount,
    ratings: ratingsCount,
  };
};

const addUser = async (userData) => {
  const { name, email, password, address, role } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new ApiError(400, 'Email is already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      address,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
};

const addStore = async (storeData) => {
  const { name, email, address, ownerId } = storeData;

  const existingStore = await prisma.store.findUnique({
    where: { email },
  });
  if (existingStore) {
    throw new ApiError(400, 'Store email is already registered.');
  }

  const newStore = await prisma.store.create({
    data: {
      name,
      email,
      address,
      ownerId: ownerId || null,
    },
  });

  return newStore;
};

const getUsers = async (query) => {
  const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = query;

  // Build prisma filter object
  const where = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (address) where.address = { contains: address, mode: 'insensitive' };
  if (role) {
    where.role = role.toUpperCase();
  }

  // Define allowed sorting columns
  const allowedSortFields = ['name', 'email', 'address', 'role'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const orderBy = { [sortField]: sortOrder === 'desc' ? 'desc' : 'asc' };

  const users = await prisma.user.findMany({
    where,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  return users;
};

const getStores = async (query) => {
  const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = query;

  const where = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (address) where.address = { contains: address, mode: 'insensitive' };

  // Fetch stores with their ratings
  const stores = await prisma.store.findMany({
    where,
    include: {
      ratings: {
        select: {
          rating: true,
        },
      },
    },
    // We sort name, email, address in Prisma, rating in memory
    orderBy: sortBy !== 'rating' ? { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' } : undefined,
  });

  // Map to calculate average rating
  let mappedStores = stores.map((store) => {
    const avgRating =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerId: store.ownerId,
      rating: parseFloat(avgRating.toFixed(2)),
    };
  });

  // Manual sorting by rating if requested
  if (sortBy === 'rating') {
    mappedStores.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.rating - a.rating;
      }
      return a.rating - b.rating;
    });
  }

  return mappedStores;
};

const getUserDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      store: {
        include: {
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const result = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
  };

  // If the user is a Store Owner, calculate and display their store's overall rating
  if (user.role === 'OWNER') {
    if (user.store) {
      const avgRating =
        user.store.ratings.length > 0
          ? user.store.ratings.reduce((sum, r) => sum + r.rating, 0) / user.store.ratings.length
          : 0;
      result.rating = parseFloat(avgRating.toFixed(2));
      result.storeName = user.store.name;
      result.storeId = user.store.id;
    } else {
      result.rating = 0; // Unassigned owner
      result.storeName = null;
      result.storeId = null;
    }
  }

  return result;
};

module.exports = {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getStores,
  getUserDetails,
};
