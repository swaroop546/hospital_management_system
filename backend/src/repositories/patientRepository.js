'use strict';

const Patient = require('../models/Patient');
const { newId, matchSearch } = require('../utils/helpers');

const clean = (p) => {
  if (!p) return null;
  const { _id, __v, id, ...rest } = p;
  return { ...rest, id: _id || id };
};
const findById = async (id) => clean(await Patient.findById(id).lean());
const findByUserId = async (userId) => clean(await Patient.findOne({ userId }).lean());
const findAll = async ({ search, doctorId, isActive } = {}) => {
  const query = {};
  if (doctorId) query.primaryDoctorId = doctorId;
  if (isActive !== undefined) query.isActive = isActive;
  const rows = await Patient.find(query).sort({ createdAt: -1 }).lean();
  return rows.filter((p) => !search || [p.firstName, p.lastName, p.email, p.patientNumber].some((v) => matchSearch(v, search))).map(clean);
};
const create = async (data) => {
  const patient = await Patient.create({ _id: newId(), patientNumber: `P-${Date.now()}`, ...data });
  return clean(patient.toObject());
};
const update = async (id, updates) => clean(await Patient.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean());

module.exports = { findById, findByUserId, findAll, create, update };
