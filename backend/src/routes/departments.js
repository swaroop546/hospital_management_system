'use strict';

const router = require('express').Router();
const controller = require('../modules/departments/departmentController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

router.use(requireAuth);
router.get('/', controller.listDepartments);
router.post('/', requireRole(ROLES.ADMIN), controller.createDepartment);
router.patch('/:id', requireRole(ROLES.ADMIN), controller.updateDepartment);

module.exports = router;
