'use strict';

const authService = require('./authService');
const { loginSchema } = require('../../validators/authValidator');
const { success, unauthorized, validationError, error } = require('../../utils/response');

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return validationError(res, parsed.error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })));
    }
    const { email, password } = parsed.data;

    const user = await authService.login(email, password);

    if (!user) {
      // Generic message to prevent credential enumeration
      return unauthorized(res, 'Invalid email or password.');
    }

    // Regenerate session to prevent fixation
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user.id;
      req.session.role = user.role;

      return success(res, { user }, 'Login successful');
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.clearCookie('hms.sid');

    return success(res, null, 'Logged out successfully');
  });
};

/**
 * GET /api/auth/me
 */
const me = async (req, res, next) => {
  try {
  const authService = require('./authService');
  const user = await authService.getUserById(req.session.userId);
  if (!user) return unauthorized(res, 'Session invalid.');
  return success(res, { user });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, me };
