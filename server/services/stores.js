// File: server/services/stores.js
const prisma = require('../config/prisma');

const getStoresForUser = async (userId, query) => {
  const { name, address, sortBy = 'name', sortOrder = 'asc' } = query;

  // Filter conditions
  const where = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (address) where.address = { contains: address, mode: 'insensitive' };

  // Fetch stores with their ratings
  const stores = await prisma.store.findMany({
    where,
    include: {
      ratings: {
        select: {
          userId: true,
          rating: true,
        },
      },
    },
    // Database level sort for name or address
    orderBy: sortBy !== 'rating' ? { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' } : undefined,
  });

  // Map stores to calculate overall average rating and extract current user's rating
  let mappedStores = stores.map((store) => {
    const totalRatings = store.ratings.length;
    const overallRating =
      totalRatings > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    const userSubmittedRating = store.ratings.find((r) => r.userId === userId);

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      overallRating: parseFloat(overallRating.toFixed(2)),
      userRating: userSubmittedRating ? userSubmittedRating.rating : null,
    };
  });

  // In-memory sort by overall rating if requested
  if (sortBy === 'rating') {
    mappedStores.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.overallRating - a.overallRating;
      }
      return a.overallRating - b.overallRating;
    });
  }

  return mappedStores;
};

module.exports = {
  getStoresForUser,
};
