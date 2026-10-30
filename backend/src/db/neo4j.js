'use strict';

const neo4j = require('neo4j-driver');
const config = require('../config');

let driver = null;
let available = false;
let lastError = null;

const connectNeo4j = async () => {
  if (!config.neo4j.uri || !config.neo4j.username || !config.neo4j.password) {
    lastError = 'Neo4j is not configured';
    return false;
  }
  driver = neo4j.driver(
    config.neo4j.uri,
    neo4j.auth.basic(config.neo4j.username, config.neo4j.password),
    { maxConnectionPoolSize: 20 }
  );
  try {
    await driver.verifyConnectivity();
    available = true;
    lastError = null;
    return true;
  } catch (err) {
    available = false;
    lastError = err.message;
    return false;
  }
};

const getDriver = () => driver;
const neo4jStatus = () => ({
  configured: Boolean(config.neo4j.uri && config.neo4j.username && config.neo4j.password),
  connected: available,
  error: available ? null : lastError,
});

const closeNeo4j = async () => {
  if (driver) await driver.close();
  driver = null;
  available = false;
};

module.exports = { connectNeo4j, getDriver, neo4jStatus, closeNeo4j, neo4j };
