'use strict';

const mongoose = require('mongoose');
const config = require('../config');

const connectMongo = async () => {
  if (!config.mongodb.uri) {
    if (config.mongodb.required) throw new Error('MONGODB_URI is required');
    return { connected: false, reason: 'not-configured' };
  }
  await mongoose.connect(config.mongodb.uri, {
    dbName: config.mongodb.database,
    serverSelectionTimeoutMS: 10000,
  });
  return { connected: true };
};

const disconnectMongo = async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
};

const mongoStatus = () => ({
  configured: Boolean(config.mongodb.uri),
  connected: mongoose.connection.readyState === 1,
});

module.exports = { connectMongo, disconnectMongo, mongoStatus, mongoose };
