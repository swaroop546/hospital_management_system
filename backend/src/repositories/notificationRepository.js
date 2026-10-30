'use strict';

const Notification = require('../models/Notification');
const { newId } = require('../utils/helpers');

const clean = (n) => {
  if (!n) return null;
  const { _id, __v, id, ...rest } = n;
  return { ...rest, id: _id || id };
};
const findByRecipient = (recipientUserId) => Notification.find({ recipientUserId }).sort({ createdAt: -1 }).lean().then((rows) => rows.map(clean));
const create = async (data) => clean((await Notification.create({ _id: newId(), ...data })).toObject());
const markRead = async (id, recipientUserId) => clean(await Notification.findOneAndUpdate({ _id: id, recipientUserId }, { $set: { readAt: new Date() } }, { new: true }).lean());

module.exports = { findByRecipient, create, markRead };
