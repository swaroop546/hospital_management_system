'use strict';

const patientRepo = require('../../repositories/patientRepository');
const { paginate } = require('../../utils/helpers');
const { success, created, notFound, forbidden } = require('../../utils/response');
const { createPatientSchema, updatePatientSchema } = require('../../validators/patientValidator');
const { ROLES } = require('../../utils/roles');
const { syncPatient } = require('../../services/graphService');

// ─── GET /api/patients ────────────────────────────────────────────────────────
const listPatients = async (req, res, next) => {
 try {
  const { search, doctorId, page = 1, limit = 20 } = req.query;

  // Doctors only see their own assigned patients
  const effectiveDoctorId =
    req.session.role === ROLES.DOCTOR ? req.session.userId : doctorId;

  const all = await patientRepo.findAll({ search, doctorId: effectiveDoctorId });
  const { items, meta } = paginate(all, page, limit);
  return success(res, items, 'OK', 200, meta);
 } catch (err) { next(err); }
};

// ─── GET /api/patients/:id ────────────────────────────────────────────────────
const getPatient = async (req, res, next) => {
 try {
  const patient = await patientRepo.findById(req.params.id);
  if (!patient) return notFound(res, 'Patient not found');

  // Patients can only see their own record
  if (req.session.role === ROLES.PATIENT) {
    const myRecord = await patientRepo.findByUserId(req.session.userId);
    if (!myRecord || myRecord.id !== patient.id) return forbidden(res);
  }

  return success(res, patient);
 } catch (err) { next(err); }
};

// ─── GET /api/patients/me ─────────────────────────────────────────────────────
const getMyPatientRecord = async (req, res, next) => {
 try {
  const patient = await patientRepo.findByUserId(req.session.userId);
  if (!patient) return notFound(res, 'Patient record not found for this account');
  return success(res, patient);
 } catch (err) { next(err); }
};

// ─── POST /api/patients ───────────────────────────────────────────────────────
const createPatient = async (req, res, next) => {
  try {
    const parsed = createPatientSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.issues });
    }
    const patient = await patientRepo.create(parsed.data);

    const graphSynchronized = await syncPatient(patient);
    return created(res, { ...patient, graphSynchronized }, 'Patient registered');
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/patients/:id ──────────────────────────────────────────────────
const updatePatient = async (req, res, next) => {
  try {
    const patient = await patientRepo.findById(req.params.id);
    if (!patient) return notFound(res, 'Patient not found');

    // Patients may only update permitted fields on their own record
    if (req.session.role === ROLES.PATIENT) {
      const myRecord = await patientRepo.findByUserId(req.session.userId);
      if (!myRecord || myRecord.id !== patient.id) return forbidden(res);
    }

    const parsed = updatePatientSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.issues });
    }

    const updated = await patientRepo.update(req.params.id, parsed.data);

    return success(res, updated, 'Patient updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { listPatients, getPatient, getMyPatientRecord, createPatient, updatePatient };
