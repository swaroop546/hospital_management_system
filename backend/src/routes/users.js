'use strict';

const router = require('express').Router();
const userController = require('../modules/users/userController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

router.use(requireAuth);

router.get('/doctors', userController.listDoctors); // accessible to authorized roles
router.get('/', requireRole(ROLES.ADMIN), userController.listUsers);
router.get('/:id', requireRole(ROLES.ADMIN), userController.getUser);
router.post('/', requireRole(ROLES.ADMIN), userController.createUser);
router.patch('/:id', requireRole(ROLES.ADMIN), userController.updateUser);

module.exports = router;
