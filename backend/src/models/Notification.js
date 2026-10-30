'use strict';

const { mongoose } = require('../db/mongo');
const { timestamps, toPlain } = require('./common');

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  recipientUserId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  readAt: { type: Date, default: null },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { ...timestamps, toJSON: { transform: toPlain }, toObject: { transform: toPlain } });

module.exports = mongoose.models.Notification || mongoose.model('Notification', schema);
