'use strict';

const { mongoose } = require('../db/mongo');
const { timestamps, toPlain } = require('./common');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, default: null, index: true },
  patientNumber: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: String,
  gender: String,
  bloodType: String,
  email: String,
  phone: String,
  address: { street: String, city: String, state: String, zip: String },
  emergencyContact: { name: String, relation: String, phone: String },
  allergies: { type: [String], default: [] },
  insuranceProvider: String,
  insurancePolicyNumber: String,
  primaryDoctorId: { type: String, default: null, index: true },
  isActive: { type: Boolean, default: true, index: true },
}, { ...timestamps, toJSON: { transform: toPlain }, toObject: { transform: toPlain } });

module.exports = mongoose.models.Patient || mongoose.model('Patient', schema);
