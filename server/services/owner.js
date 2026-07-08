// File: server/services/owner.js
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const getOwnerDashboard = async (ownerId, query) => {
  const { sortBy = 'name', sortOrder = 'asc' } = query;

  // Find the store owned by this owner
  const store = await prisma.store.findUnique({
    where: { ownerId },
    include: {
      ratings: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
            },
          },
        },
      },
    },
  });

  if (!store) {
    throw new ApiError(404, 'You do not own any registered store on this platform.');
  }

  // Calculate average rating
  const totalRatings = store.ratings.length;
  const averageRating =
    totalRatings > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

  // Map users who submitted ratings
  let raters = store.ratings.map((r) => ({
    userId: r.user.id,
    name: r.user.name,
    email: r.user.email,
    address: r.user.address,
    rating: r.rating,
    submittedAt: r.createdAt,
  }));

  // Sort raters list
  const allowedSortFields = ['name', 'email', 'rating'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';

  raters.sort((a, b) => {
    let comparison = 0;
    if (sortField === 'rating') {
      comparison = a.rating - b.rating;
    } else {
      comparison = a[sortField].localeCompare(b[sortField]);
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return {
    storeName: store.name,
    storeId: store.id,
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalReviews: totalRatings,
    reviews: raters,
  };
};

module.exports = {
  getOwnerDashboard,
};
