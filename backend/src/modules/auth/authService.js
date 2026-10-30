'use strict';

const bcrypt = require('bcryptjs');
const userRepo = require('../../repositories/userRepository');
const { omit } = require('../../utils/helpers');

const SAFE_USER_FIELDS = ['passwordHash'];

const sanitize = (user) => omit(user, SAFE_USER_FIELDS);

/**
 * Authenticate a user by email/password.
 * Returns sanitized user or null. Uses generic error message to prevent enumeration.
 */
const login = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user || !user.isActive) {
    // Still run bcrypt compare to prevent timing attacks
    await bcrypt.compare(password, '$2a$12$invalidhashfortimingprotection000000000000000000000');
    return null;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return sanitize(user);
};

/**
 * Get sanitized user by ID.
 */
const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) return null;
  return sanitize(user);
};

module.exports = { login, getUserById, sanitize };
