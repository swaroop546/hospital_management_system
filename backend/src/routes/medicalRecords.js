'use strict';

const router = require('express').Router();
const mrController = require('../modules/medical-records/medicalRecordController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

router.use(requireAuth);

// Consultations
router.get('/consultations', mrController.listConsultations);
router.post('/consultations', requireRole(ROLES.DOCTOR), mrController.createConsultation);
router.patch('/consultations/:id/finalize', requireRole(ROLES.DOCTOR, ROLES.ADMIN), mrController.finalizeConsultation);

// Diagnoses
router.get('/diagnoses', mrController.listDiagnoses);
router.post('/diagnoses', requireRole(ROLES.DOCTOR), mrController.createDiagnosis);

// Clinical notes
router.get('/notes', mrController.listNotes);
router.post('/notes', requireRole(ROLES.DOCTOR, ROLES.NURSE), mrController.createNote);

module.exports = router;
