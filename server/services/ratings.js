// File: server/services/ratings.js
const prisma = require('../config/prisma');

const submitRating = async (userId, storeId, rating) => {
  // Use Prisma's upsert using the compound unique key userId_storeId
  const upsertedRating = await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
    update: {
      rating,
    },
    create: {
      userId,
      storeId,
      rating,
    },
  });

  return upsertedRating;
};

module.exports = {
  submitRating,
};
