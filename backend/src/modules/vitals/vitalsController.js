'use strict';

const vitalsRepo = require('../../repositories/vitalsRepository');
const patientRepo = require('../../repositories/patientRepository');
const { success, created, notFound, forbidden } = require('../../utils/response');
const { recordVitalsSchema } = require('../../validators/vitalsValidator');
const { ROLES } = require('../../utils/roles');
const { now } = require('../../utils/helpers');

// ─── GET /api/vitals ──────────────────────────────────────────────────────────
const listVitals = async (req, res, next) => {
 try {
  const { patientId } = req.query;

  if (req.session.role === ROLES.PATIENT) {
    const myRecord = await patientRepo.findByUserId(req.session.userId);
    if (!myRecord) return success(res, []);
    return success(res, await vitalsRepo.findByPatient(myRecord.id));
  }

  if (!patientId) return res.status(400).json({ success: false, data: null, error: 'patientId query parameter required' });
  return success(res, await vitalsRepo.findByPatient(patientId));
 } catch (err) { next(err); }
};

// ─── POST /api/vitals ─────────────────────────────────────────────────────────
const recordVitals = async (req, res, next) => {
  try {
    const parsed = recordVitalsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ success: false, data: null, error: 'Validation failed', details: parsed.error.errors });
    }
    if (!await patientRepo.findById(parsed.data.patientId)) return notFound(res, 'Patient not found');

    const record = await vitalsRepo.create({
      ...parsed.data,
      recordedBy: req.session.userId,
      recordedAt: parsed.data.recordedAt || now(),
    });

    return created(res, record, 'Vitals recorded');
  } catch (err) {
    next(err);
  }
};

module.exports = { listVitals, recordVitals };
