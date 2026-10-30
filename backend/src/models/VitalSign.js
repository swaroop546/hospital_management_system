'use strict';

const { mongoose } = require('../db/mongo');
const { timestamps, toPlain } = require('./common');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  patientId: { type: String, required: true, index: true },
  recordedBy: { type: String, required: true },
  bloodPressureSystolic: Number,
  bloodPressureDiastolic: Number,
  heartRate: Number,
  temperature: Number,
  temperatureUnit: String,
  respiratoryRate: Number,
  oxygenSaturation: Number,
  heightCm: Number,
  weightKg: Number,
  notes: String,
  recordedAt: { type: Date, required: true, index: true },
}, { ...timestamps, toJSON: { transform: toPlain }, toObject: { transform: toPlain } });

module.exports = mongoose.models.VitalSign || mongoose.model('VitalSign', schema);
