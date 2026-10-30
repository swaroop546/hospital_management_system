'use strict';

const timestamps = { createdAt: true, updatedAt: true };

const toPlain = (_, ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  return ret;
};

module.exports = { timestamps, toPlain };
