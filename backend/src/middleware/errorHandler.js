'use strict';

const config = require('../config');

/**
 * Centralized error-handling middleware.
 * Must be registered last (after all routes).
 * Never exposes stack traces in production.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const isDev = config.isDev;

  // Zod validation errors surfaced as thrown objects
  if (err.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      data: null,
      error: 'Validation failed',
      details: err.errors?.map((e) => ({ path: e.path.join('.'), message: e.message })) || [],
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode < 500 ? err.message : 'Internal server error';

  if (statusCode >= 500) {
    console.error('[ERROR]', err.message, isDev ? err.stack : '');
  }

  return res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
    ...(isDev && statusCode >= 500 ? { stack: err.stack } : {}),
  });
};

/**
 * 404 handler — register after all routes but before errorHandler.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
