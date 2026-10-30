'use strict';

const VitalSign = require('../models/VitalSign');
const { newId } = require('../utils/helpers');

const clean = (v) => {
  if (!v) return null;
  const { _id, __v, id, ...rest } = v;
  return { ...rest, id: _id || id };
};
const findByPatient = (patientId) => VitalSign.find({ patientId }).sort({ recordedAt: -1 }).lean().then((rows) => rows.map(clean));
const findById = (id) => VitalSign.findById(id).lean().then(clean);
const create = async (data) => clean((await VitalSign.create({ _id: newId(), ...data })).toObject());

module.exports = { findByPatient, findById, create };
