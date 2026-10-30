'use strict';

const repo = require('../../repositories/notificationRepository');
const { success, created, notFound } = require('../../utils/response');

const listNotifications = async (req, res, next) => {
  try { return success(res, await repo.findByRecipient(req.session.userId)); } catch (err) { next(err); }
};
const createNotification = async (req, res, next) => {
  try { return created(res, await repo.create({ ...req.body, recipientUserId: req.body.recipientUserId || req.session.userId }), 'Notification created'); } catch (err) { next(err); }
};
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await repo.markRead(req.params.id, req.session.userId);
    if (!notification) return notFound(res, 'Notification not found');
    return success(res, notification, 'Notification marked as read');
  } catch (err) { next(err); }
};

module.exports = { listNotifications, createNotification, markNotificationRead };
