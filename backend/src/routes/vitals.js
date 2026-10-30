'use strict';

const router = require('express').Router();
const vitalsController = require('../modules/vitals/vitalsController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

router.use(requireAuth);

router.get('/', vitalsController.listVitals);
router.post('/', requireRole(ROLES.NURSE, ROLES.DOCTOR), vitalsController.recordVitals);

module.exports = router;
