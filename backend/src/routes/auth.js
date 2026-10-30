'use strict';

const router = require('express').Router();
const authController = require('../modules/auth/authController');
const { requireAuth } = require('../middleware/auth');

// Public
router.post('/login', authController.login);

// Protected
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;
