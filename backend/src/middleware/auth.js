'use strict';

const { error, unauthorized, forbidden } = require('../utils/response');
const { hasPermission } = require('../utils/roles');

/**
 * requireAuth — verifies an active session exists.
 * Must be applied to all protected routes.
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return unauthorized(res, 'Authentication required. Please log in.');
  }
  next();
};

/**
 * requireRole — verifies the authenticated user holds one of the listed roles.
 * Must be used after requireAuth.
 * @param {...string} roles
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return unauthorized(res);
  }
  if (!roles.includes(req.session.role)) {
    return forbidden(res, 'You do not have permission to perform this action.');
  }
  next();
};

/**
 * requirePermission — verifies the user's role has a named permission.
 * Must be used after requireAuth.
 * @param {string} permission
 */
const requirePermission = (permission) => (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return unauthorized(res);
  }
  if (!hasPermission(req.session.role, permission)) {
    return forbidden(res, 'You do not have permission to perform this action.');
  }
  next();
};

module.exports = { requireAuth, requireRole, requirePermission };
