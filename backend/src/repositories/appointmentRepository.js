'use strict';

const Appointment = require('../models/Appointment');
const { newId } = require('../utils/helpers');

const APPOINTMENT_STATUSES = Object.freeze({
  SCHEDULED: 'scheduled', CONFIRMED: 'confirmed', CHECKED_IN: 'checked_in',
  IN_PROGRESS: 'in_progress', COMPLETED: 'completed', CANCELLED: 'cancelled', NO_SHOW: 'no_show',
});
const clean = (a) => {
  if (!a) return null;
  const { _id, __v, id, ...rest } = a;
  return { ...rest, id: _id || id };
};
const findById = async (id) => clean(await Appointment.findById(id).lean());
const findAll = async ({ patientId, doctorId, status, dateFrom, dateTo } = {}) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (doctorId) query.doctorId = doctorId;
  if (status) query.status = status;
  if (dateFrom || dateTo) query.scheduledAt = {};
  if (dateFrom) query.scheduledAt.$gte = new Date(dateFrom);
  if (dateTo) query.scheduledAt.$lte = new Date(dateTo);
  return (await Appointment.find(query).sort({ scheduledAt: 1 }).lean()).map(clean);
};
const hasConflict = async (doctorId, scheduledAt, durationMinutes, excludeId = null) => {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const active = [APPOINTMENT_STATUSES.SCHEDULED, APPOINTMENT_STATUSES.CONFIRMED, APPOINTMENT_STATUSES.IN_PROGRESS];
  const rows = await Appointment.find({ doctorId, status: { $in: active }, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }).lean();
  return rows.some((a) => {
    const aStart = new Date(a.scheduledAt);
    const aEnd = new Date(aStart.getTime() + a.durationMinutes * 60000);
    return start < aEnd && end > aStart;
  });
};
const create = async (data) => clean((await Appointment.create({ _id: newId(), ...data })).toObject());
const update = async (id, updates) => clean(await Appointment.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean());

module.exports = { findById, findAll, hasConflict, create, update, APPOINTMENT_STATUSES };
