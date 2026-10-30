'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a new UUID v4.
 */
const newId = () => uuidv4();

/**
 * Return current ISO timestamp string.
 */
const now = () => new Date().toISOString();

/**
 * Apply pagination to an array.
 * @param {Array} items
 * @param {number} page  1-indexed
 * @param {number} limit items per page
 * @returns {{ items: Array, meta: object }}
 */
const paginate = (items, page = 1, limit = 20) => {
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const total = items.length;
  const totalPages = Math.ceil(total / l);
  const start = (p - 1) * l;
  const end = start + l;
  return {
    items: items.slice(start, end),
    meta: { page: p, limit: l, total, totalPages },
  };
};

/**
 * Safely strip specified keys from an object before returning it.
 * @param {object} obj
 * @param {string[]} keys
 */
const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((k) => delete result[k]);
  return result;
};

/**
 * Case-insensitive substring match helper.
 */
const matchSearch = (value, query) =>
  String(value ?? '').toLowerCase().includes(String(query ?? '').toLowerCase());

module.exports = { newId, now, paginate, omit, matchSearch };
