'use strict';

const mrRepo = require('../../repositories/medicalRecordRepository');
const patientRepo = require('../../repositories/patientRepository');
const { success, created, notFound, forbidden } = require('../../utils/response');
const { createConsultationSchema, createDiagnosisSchema, createNoteSchema } = require('../../validators/medicalRecordValidator');
const { ROLES } = require('../../utils/roles');
const { now } = require('../../utils/helpers');

const canAccessPatientRecord = async (req, patientId) => {
  if (req.session.role === ROLES.PATIENT) {
    const myRecord = await patientRepo.findByUserId(req.session.userId);
    return myRecord && myRecord.id === patientId;
  }
  return [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE].includes(req.session.role);
};

// ─── Consultations ────────────────────────────────────────────────────────────
const listConsultations = async (req, res, next) => {
 try {
  const { patientId } = req.query;
  if (!patientId) return res.status(400).json({ success: false, data: null, error: 'patientId query parameter required' });
  if (!await canAccessPatientRecord(req, patientId)) return forbidden(res);
  return success(res, await mrRepo.findConsultationsByPatient(patientId));
 } catch (err) { next(err); }
};

const createConsultation = async (req, res, next) => {
  try {
    const parsed = createConsultationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }
    if (!await patientRepo.findById(parsed.data.patientId)) return notFound(res, 'Patient not found');

    const consult = await mrRepo.createConsultation({ ...parsed.data, doctorId: req.session.userId });

    return created(res, consult, 'Consultation created');
  } catch (err) {
    next(err);
  }
};

const finalizeConsultation = async (req, res, next) => {
  try {
    const consult = await mrRepo.findConsultationById(req.params.id);
    if (!consult) return notFound(res, 'Consultation not found');
    if (consult.doctorId !== req.session.userId && req.session.role !== ROLES.ADMIN) {
      return forbidden(res, 'Only the authoring doctor can finalize this consultation.');
    }
    if (consult.status === 'finalized') {
      return res.status(409).json({ success: false, data: null, error: 'Consultation is already finalized.' });
    }
    const updated = await mrRepo.updateConsultation(req.params.id, { ...req.body, status: 'finalized' });
    return success(res, updated, 'Consultation finalized');
  } catch (err) {
    next(err);
  }
};

// ─── Diagnoses ────────────────────────────────────────────────────────────────
const listDiagnoses = async (req, res, next) => {
 try {
  const { patientId } = req.query;
  if (!patientId) return res.status(400).json({ success: false, data: null, error: 'patientId required' });
  if (!await canAccessPatientRecord(req, patientId)) return forbidden(res);
  return success(res, await mrRepo.findDiagnosesByPatient(patientId));
 } catch (err) { next(err); }
};

const createDiagnosis = async (req, res, next) => {
  try {
    const parsed = createDiagnosisSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }
    if (!await patientRepo.findById(parsed.data.patientId)) return notFound(res, 'Patient not found');
    const diag = await mrRepo.createDiagnosis({ ...parsed.data, doctorId: req.session.userId, diagnosedAt: now() });
    return created(res, diag, 'Diagnosis recorded');
  } catch (err) {
    next(err);
  }
};

// ─── Clinical Notes ───────────────────────────────────────────────────────────
const listNotes = async (req, res, next) => {
 try {
  const { patientId } = req.query;
  if (!patientId) return res.status(400).json({ success: false, data: null, error: 'patientId required' });
  if (!await canAccessPatientRecord(req, patientId)) return forbidden(res);
  return success(res, await mrRepo.findNotesByPatient(patientId));
 } catch (err) { next(err); }
};

const createNote = async (req, res, next) => {
  try {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }
    if (!await patientRepo.findById(parsed.data.patientId)) return notFound(res, 'Patient not found');
    const note = await mrRepo.createNote({ ...parsed.data, authorId: req.session.userId, authorRole: req.session.role });
    return created(res, note, 'Note recorded');
  } catch (err) {
    next(err);
  }
};

module.exports = { listConsultations, createConsultation, finalizeConsultation, listDiagnoses, createDiagnosis, listNotes, createNote };
