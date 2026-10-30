'use strict';

const router = require('express').Router();
const apptController = require('../modules/appointments/appointmentController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

router.use(requireAuth);

router.get('/', apptController.listAppointments);
router.get('/:id', apptController.getAppointment);
router.post(
  '/',
  requireRole(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT),
  apptController.createAppointment
);
router.patch(
  '/:id',
  requireRole(ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.PATIENT),
  apptController.updateAppointment
);

module.exports = router;
