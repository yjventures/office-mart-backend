const express = require('express');
const { emailAPI } = require('../utils/api_constant');
const {
  sendEmailwithTextOnly,
  sendEmailwithTextAndFile,
  sendEmailToMultipleUsers,
} = require('../services/email_services');
const { setPathForUploader } = require("../middlewares/file_uploader");

const router = express.Router();
const upload = setPathForUploader();

// ? API to send text in email
router.post(emailAPI.SEND_TEXT, sendEmailwithTextOnly);

// ? API to send text and file in email
router.post(emailAPI.SEND_FILE_AND_TEXT, upload.single('file'), sendEmailwithTextAndFile);

// ? API to send text multple person in email
router.post(emailAPI.SEND_MULTIPLE_EMAIL, sendEmailToMultipleUsers);

module.exports = router;