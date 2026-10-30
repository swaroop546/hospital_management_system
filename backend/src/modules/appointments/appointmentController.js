'use strict';

const apptRepo = require('../../repositories/appointmentRepository');
const patientRepo = require('../../repositories/patientRepository');
const { paginate } = require('../../utils/helpers');
const { success, created, notFound, forbidden, conflict } = require('../../utils/response');
const { createAppointmentSchema, updateAppointmentSchema } = require('../../validators/appointmentValidator');
const { ROLES } = require('../../utils/roles');
const { syncAppointment } = require('../../services/graphService');

// ─── GET /api/appointments ────────────────────────────────────────────────────
const listAppointments = async (req, res, next) => {
 try {
  const { patientId, doctorId, status, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

  let filter = { patientId, doctorId, status, dateFrom, dateTo };

  // Role-scoped filtering
  if (req.session.role === ROLES.DOCTOR) filter.doctorId = req.session.userId;
  if (req.session.role === ROLES.PATIENT) {
    const myRecord = await patientRepo.findByUserId(req.session.userId);
    if (!myRecord) return success(res, [], 'OK', 200, { page: 1, limit: 20, total: 0, totalPages: 0 });
    filter.patientId = myRecord.id;
  }

  const all = await apptRepo.findAll(filter);
  const { items, meta } = paginate(all, page, limit);
  return success(res, items, 'OK', 200, meta);
 } catch (err) { next(err); }
};

// ─── GET /api/appointments/:id ────────────────────────────────────────────────
const getAppointment = async (req, res, next) => {
 try {
  const appt = await apptRepo.findById(req.params.id);
  if (!appt) return notFound(res, 'Appointment not found');

  // Patients can only view their own appointments
  if (req.session.role === ROLES.PATIENT) {
    const myRecord = await patientRepo.findByUserId(req.session.userId);
    if (!myRecord || myRecord.id !== appt.patientId) return forbidden(res);
  }

  // Doctors can only view their own appointments
  if (req.session.role === ROLES.DOCTOR && appt.doctorId !== req.session.userId) {
    return forbidden(res);
  }

  return success(res, appt);
 } catch (err) { next(err); }
};

// ─── POST /api/appointments ───────────────────────────────────────────────────
const createAppointment = async (req, res, next) => {
  try {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }
    const data = parsed.data;

    // Patients can only create appointments for themselves
    if (req.session.role === ROLES.PATIENT) {
      const myRecord = await patientRepo.findByUserId(req.session.userId);
      if (!myRecord || myRecord.id !== data.patientId) return forbidden(res);
    }

    if (!await patientRepo.findById(data.patientId)) return notFound(res, 'Patient not found');

    // Conflict detection
    if (await apptRepo.hasConflict(data.doctorId, data.scheduledAt, data.durationMinutes)) {
      return conflict(res, 'The selected time slot conflicts with an existing appointment for this doctor.');
    }

    const appt = await apptRepo.create({
      ...data,
      status: apptRepo.APPOINTMENT_STATUSES.SCHEDULED,
      createdBy: req.session.userId,
    });

    const graphSynchronized = await syncAppointment(appt);
    return created(res, { ...appt, graphSynchronized }, 'Appointment created');
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/appointments/:id ──────────────────────────────────────────────
const updateAppointment = async (req, res, next) => {
  try {
    const appt = await apptRepo.findById(req.params.id);
    if (!appt) return notFound(res, 'Appointment not found');

    // Patients can only cancel their own appointments
    if (req.session.role === ROLES.PATIENT) {
      const myRecord = await patientRepo.findByUserId(req.session.userId);
      if (!myRecord || myRecord.id !== appt.patientId) return forbidden(res);
      const allowedUpdates = ['status'];
      const keys = Object.keys(req.body);
      if (keys.some((k) => !allowedUpdates.includes(k))) return forbidden(res, 'Patients may only update appointment status.');
      if (req.body.status && req.body.status !== apptRepo.APPOINTMENT_STATUSES.CANCELLED) {
        return forbidden(res, 'Patients may only cancel appointments.');
      }
    }

    const parsed = updateAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }

    // If rescheduling, check for conflicts
    if (parsed.data.scheduledAt) {
      const duration = parsed.data.durationMinutes || appt.durationMinutes;
      const doctorId = appt.doctorId;
      if (await apptRepo.hasConflict(doctorId, parsed.data.scheduledAt, duration, appt.id)) {
        return conflict(res, 'The new time slot conflicts with another appointment.');
      }
    }

    const updated = await apptRepo.update(req.params.id, parsed.data);

    return success(res, updated, 'Appointment updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { listAppointments, getAppointment, createAppointment, updateAppointment };
