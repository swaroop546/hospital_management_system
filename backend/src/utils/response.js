'use strict';

/**
 * Consistent JSON response helpers.
 * All API responses use the same shape:
 *   { success, data|error, message?, meta? }
 */

const success = (res, data = null, message = 'OK', statusCode = 200, meta = null) => {
  const body = { success: true, data, message };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

const created = (res, data = null, message = 'Created') =>
  success(res, data, message, 201);

const error = (res, message = 'An error occurred', statusCode = 500, details = null) => {
  const body = { success: false, data: null, error: message };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
};

const validationError = (res, issues) =>
  error(res, 'Validation failed', 422, issues);

const notFound = (res, message = 'Resource not found') =>
  error(res, message, 404);

const unauthorized = (res, message = 'Authentication required') =>
  error(res, message, 401);

const forbidden = (res, message = 'Access denied') =>
  error(res, message, 403);

const conflict = (res, message = 'Conflict') =>
  error(res, message, 409);

module.exports = { success, created, error, validationError, notFound, unauthorized, forbidden, conflict };
