'use strict';

const User = require('../models/User');
const { newId, now, matchSearch } = require('../utils/helpers');

const clean = (u) => {
  if (!u) return null;
  const { _id, __v, id, ...rest } = u;
  return { ...rest, id: _id || id };
};
const findById = (id) => User.findById(id).lean().then(clean);
const findByEmail = (email) => User.findOne({ email: String(email).toLowerCase() }).lean().then(clean);
const findAll = async ({ search, role, isActive } = {}) => {
  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive;
  const users = await User.find(query).sort({ createdAt: 1 }).lean();
  if (!search) return users.map(clean);
  return users
    .filter((u) => matchSearch(u.firstName, search) || matchSearch(u.lastName, search) || matchSearch(u.email, search))
    .map(clean);
};
const create = async (data) => {
  const user = await User.create({ _id: newId(), ...data });
  return clean(user.toObject());
};
const update = async (id, updates) => {
  const user = await User.findByIdAndUpdate(id, { $set: updates, updatedAt: now() }, { new: true }).lean();
  return clean(user);
};
const remove = (id) => User.findByIdAndDelete(id).then(Boolean);

module.exports = { findById, findByEmail, findAll, create, update, remove };
