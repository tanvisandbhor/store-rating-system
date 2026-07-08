// File: server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Load env variables
require('dotenv').config();

// Append sslmode=require if it is Render PostgreSQL and lacks it
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') && !process.env.DATABASE_URL.includes('sslmode')) {
  if (process.env.DATABASE_URL.includes('?')) {
    process.env.DATABASE_URL += '&sslmode=require';
  } else {
    process.env.DATABASE_URL += '?sslmode=require';
  }
}

// We import our configured client
const prisma = require('../config/prisma');

async function main() {
  console.log('Seeding database...');

  // Clean existing data to avoid conflicts
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const ownerHash = await bcrypt.hash('Owner@123', 10);
  const userHash = await bcrypt.hash('User@123', 10);

  // 1. Create ADMIN
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@example.com',
      password: adminHash,
      address: 'Head Office, Pune',
      role: 'ADMIN',
    },
  });

  // 2. Create OWNER
  const owner = await prisma.user.create({
    data: {
      name: 'Rahul Sharma Store Owner',
      email: 'owner@example.com',
      password: ownerHash,
      address: 'Baner, Pune',
      role: 'OWNER',
    },
  });

  // 3. Create USER
  const normalUser = await prisma.user.create({
    data: {
      name: 'Tanvi Sandbhor Demo User',
      email: 'user@example.com',
      password: userHash,
      address: 'Rajgurunagar, Pune',
      role: 'USER',
    },
  });

  // 4. Create STORES
  // Tech World - assigned to Owner
  const techWorld = await prisma.store.create({
    data: {
      name: 'Tech World',
      email: 'techworld@example.com',
      address: 'Baner Road, Pune',
      ownerId: owner.id,
    },
  });

  // Fresh Mart - unassigned
  await prisma.store.create({
    data: {
      name: 'Fresh Mart',
      email: 'freshmart@example.com',
      address: 'Kothrud, Pune',
    },
  });

  // Vision Electronics - unassigned
  await prisma.store.create({
    data: {
      name: 'Vision Electronics',
      email: 'vision@example.com',
      address: 'Swargate, Pune',
    },
  });

  console.log('Database successfully seeded!');
  
  // Show counts
  const userCount = await prisma.user.count();
  const storeCount = await prisma.store.count();
  const ratingCount = await prisma.rating.count();

  console.log(`\n--- Verification Counts ---`);
  console.log(`TOTAL_USERS: ${userCount}`);
  console.log(`TOTAL_STORES: ${storeCount}`);
  console.log(`TOTAL_RATINGS: ${ratingCount}`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
