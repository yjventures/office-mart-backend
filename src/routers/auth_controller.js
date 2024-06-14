const express = require('express');
const { authAPI } = require('../utils/api_constant');
const { login, verifyEmail, sendNotification, sendMultipleNotification, sendMultipleUserNotifications } = require('../services/auth_services');

const router = express.Router();

// ? API to login a user
router.post(authAPI.LOGIN, login);

// ? API to verify email
router.put(authAPI.VERIFY, verifyEmail);

// ? API to send single device Notification
router.post('/send-notification', sendNotification);

// ? API to send multiple device Notification
router.post('/send-multidevice-notification', sendMultipleNotification);

// ? API to send multiple users Notification
router.post('/send-multiple-users-notification', sendMultipleUserNotifications);

module.exports = router;
