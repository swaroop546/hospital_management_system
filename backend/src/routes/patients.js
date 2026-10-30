'use strict';

const router = require('express').Router();
const patientController = require('../modules/patients/patientController');
const { requireAuth, requireRole, requirePermission } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

router.use(requireAuth);

// Patient self-access
router.get('/me', requireRole(ROLES.PATIENT), patientController.getMyPatientRecord);

// Staff access
router.get(
  '/',
  requireRole(ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST),
  patientController.listPatients
);
router.get(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST, ROLES.PATIENT),
  patientController.getPatient
);
router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.RECEPTIONIST),
  patientController.createPatient
);
router.patch(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT),
  patientController.updatePatient
);

module.exports = router;
