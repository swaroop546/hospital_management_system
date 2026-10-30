'use strict';

const app = require('./app');
const config = require('./config');
const { connectMongo, disconnectMongo } = require('./db/mongo');
const { connectNeo4j, closeNeo4j } = require('./db/neo4j');
const { seedDatabase } = require('./db/seed');
const { initializeGraph } = require('./services/graphService');

let server;

const start = async () => {
  await connectMongo();
  await seedDatabase();
  const graphAvailable = await connectNeo4j();
  if (graphAvailable) await initializeGraph();
  server = app.listen(config.port, () => {
    console.log(`\nHospital Management API`);
    console.log(`   Environment : ${config.nodeEnv}`);
    console.log(`   Port        : ${config.port}`);
    console.log(`   Health      : http://localhost:${config.port}/api/health`);
    console.log(`   Frontend    : ${config.frontendOrigin}`);
    console.log(`   MongoDB     : connected`);
    console.log(`   Neo4j       : ${graphAvailable ? 'connected' : 'degraded/unavailable'}\n`);
  });
  server.on('error', handleServerError);
};

const handleServerError = (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[FATAL] Port ${config.port} is already in use`);
  } else {
    console.error('[FATAL] Server error:', err.message);
  }
  process.exit(1);
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await closeNeo4j();
  await disconnectMongo();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((err) => {
  console.error('[FATAL] Startup failed:', err.message);
  process.exit(1);
});
