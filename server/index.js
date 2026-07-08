// File: server/index.js
const express = require('express');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storesRoutes = require('./routes/stores');
const ratingsRoutes = require('./routes/ratings');
const ownerRoutes = require('./routes/owner');
const errorHandler = require('./middleware/error');
const prisma = require('./config/prisma');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging (Simple logger middleware)
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// Database Connection Verification
prisma.$connect()
  .then(() => console.log('Successfully connected to the PostgreSQL database.'))
  .catch((err) => {
    console.error('Error connecting to the PostgreSQL database:', err.message);
    process.exit(1);
  });

// API Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/stores', storesRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/owner', ownerRoutes);

// 404 Route fallback
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

// Handle unhandled rejections/exceptions gracefully
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
