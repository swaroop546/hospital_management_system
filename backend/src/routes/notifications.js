'use strict';

const router = require('express').Router();
const controller = require('../modules/notifications/notificationController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', controller.listNotifications);
router.post('/', controller.createNotification);
router.patch('/:id/read', controller.markNotificationRead);

module.exports = router;
