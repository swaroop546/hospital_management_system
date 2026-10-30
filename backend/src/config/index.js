'use strict';

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',

  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',

  mongodb: {
    uri: process.env.MONGODB_URI || '',
    database: process.env.MONGODB_DATABASE || undefined,
    required: process.env.MONGODB_REQUIRED !== 'false',
  },

  neo4j: {
    uri: process.env.NEO4J_URI || '',
    username: process.env.NEO4J_USERNAME || '',
    password: process.env.NEO4J_PASSWORD || '',
    database: process.env.NEO4J_DATABASE || 'neo4j',
  },

  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    maxAgeMs: parseInt(process.env.SESSION_MAX_AGE_MS || '86400000', 10),
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },
};

if (config.session.secret === 'dev-secret-change-in-production' && !config.isDev) {
  console.error('[FATAL] SESSION_SECRET must be set in production');
  process.exit(1);
}

module.exports = config;
