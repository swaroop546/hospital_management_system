'use strict';

const { mongoose } = require('../db/mongo');
const { timestamps, toPlain } = require('./common');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  recordType: { type: String, required: true, enum: ['consultation', 'diagnosis', 'note'], index: true },
  patientId: { type: String, required: true, index: true },
  doctorId: String,
  appointmentId: String,
  consultationId: String,
  authorId: String,
  authorRole: String,
  diagnosedAt: Date,
  status: String,
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { ...timestamps, toJSON: { transform: toPlain }, toObject: { transform: toPlain } });

schema.index({ patientId: 1, recordType: 1, createdAt: -1 });

module.exports = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', schema);
