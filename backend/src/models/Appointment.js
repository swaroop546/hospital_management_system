'use strict';

const { mongoose } = require('../db/mongo');
const { timestamps, toPlain } = require('./common');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  patientId: { type: String, required: true, index: true },
  doctorId: { type: String, required: true, index: true },
  departmentId: { type: String, default: null, index: true },
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  type: String,
  reason: String,
  status: { type: String, required: true, index: true },
  notes: String,
  createdBy: { type: String, required: true },
}, { ...timestamps, toJSON: { transform: toPlain }, toObject: { transform: toPlain } });

schema.index({ doctorId: 1, scheduledAt: 1, status: 1 });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', schema);
