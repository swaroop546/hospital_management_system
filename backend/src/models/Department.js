'use strict';

const { mongoose } = require('../db/mongo');
const { timestamps, toPlain } = require('./common');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, unique: true, index: true },
  description: String,
  isActive: { type: Boolean, default: true, index: true },
}, { ...timestamps, toJSON: { transform: toPlain }, toObject: { transform: toPlain } });

module.exports = mongoose.models.Department || mongoose.model('Department', schema);
