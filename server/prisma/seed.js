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
  const admin2Hash = await bcrypt.hash('Admin2@123', 10);

  // 1. Create ADMINS
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@example.com',
      password: adminHash,
      address: 'Head Office, Pune',
      role: 'ADMIN',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'System Administrator Two',
      email: 'admin2@example.com',
      password: admin2Hash,
      address: 'Secondary Office, Mumbai',
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

  // 5. Generate 10 additional Owners and 10 corresponding Stores programmatically
  console.log('Generating 10 additional owners and 10 stores...');
  for (let i = 1; i <= 10; i++) {
    const loopOwnerHash = await bcrypt.hash(`Owner@123`, 10);
    const loopOwner = await prisma.user.create({
      data: {
        name: `Owner Account ${i}`,
        email: `owner${i}@example.com`,
        password: loopOwnerHash,
        address: `Commercial Area Sector ${i}, Pune`,
        role: 'OWNER',
      },
    });

    await prisma.store.create({
      data: {
        name: `Store Outlet ${i}`,
        email: `store${i}@example.com`,
        address: `Commercial Plaza Suite ${i}, Pune`,
        ownerId: loopOwner.id,
      },
    });
  }

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
