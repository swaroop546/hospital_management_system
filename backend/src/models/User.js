'use strict';

const { mongoose } = require('../db/mongo');
const { timestamps, toPlain } = require('./common');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true, index: true },
  department: { type: String, default: '' },
  departmentId: { type: String, default: null, index: true },
  specialty: { type: String },
  phone: { type: String, default: '' },
  isActive: { type: Boolean, default: true, index: true },
}, { ...timestamps, toJSON: { transform: toPlain }, toObject: { transform: toPlain } });

module.exports = mongoose.models.User || mongoose.model('User', schema);
