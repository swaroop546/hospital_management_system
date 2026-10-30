'use strict';

const Department = require('../models/Department');
const { newId } = require('../utils/helpers');

const clean = (d) => {
  if (!d) return null;
  const { _id, __v, id, ...rest } = d;
  return { ...rest, id: _id || id };
};
const findAll = (filter = {}) => Department.find(filter).sort({ name: 1 }).lean().then((rows) => rows.map(clean));
const findById = (id) => Department.findById(id).lean().then(clean);
const create = async (data) => clean((await Department.create({ _id: newId(), ...data })).toObject());
const update = async (id, updates) => clean(await Department.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean());

module.exports = { findAll, findById, create, update };
