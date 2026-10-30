'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const { MongoStore } = require('connect-mongo');

const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { mongoStatus } = require('./db/mongo');
const { neo4jStatus } = require('./db/neo4j');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const medicalRecordRoutes = require('./routes/medicalRecords');
const vitalsRoutes = require('./routes/vitals');
const departmentRoutes = require('./routes/departments');
const notificationRoutes = require('./routes/notifications');

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'same-site' },
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
  })
);

// ─── Request Logging ──────────────────────────────────────────────────────────
// Custom format omits Authorization headers and body (never log credentials)
app.use(morgan(config.isDev ? 'dev' : 'combined'));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Session ──────────────────────────────────────────────────────────────────
// WARNING: MemoryStore is development-only and will leak memory and lose sessions on restart.
// Replace with a persistent session store (e.g. connect-redis, connect-pg-simple) in production.
app.use(
  session({
    store: config.mongodb.uri
      ? MongoStore.create({ mongoUrl: config.mongodb.uri, ttl: Math.floor(config.session.maxAgeMs / 1000) })
      : new MemoryStore({ checkPeriod: 86400000 }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    name: 'hms.sid', // Do not use default 'connect.sid' name
    cookie: {
      httpOnly: true,
      secure: config.session.secure,
      sameSite: config.session.sameSite,
      maxAge: config.session.maxAgeMs,
    },
  })
);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      dependencies: { mongodb: mongoStatus(), neo4j: neo4jStatus() },
    },
    message: 'Hospital Management API is running',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
