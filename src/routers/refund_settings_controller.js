const express = require("express");
const { body } = require("express-validator");
const { refundSettingAPI } = require("../utils/api_constant");
const {
  createRefundSetting,
  updateRefundSetting,
  getRefundSetting,
} = require("../services/refund_settings_services");
const { authenticateToken } = require("../middlewares/token_authenticator");

const router = express.Router();

// ? API to create refund settings
router.post(refundSettingAPI.CREATE, authenticateToken, createRefundSetting);

// ? API to get refund settings
router.get(refundSettingAPI.GET_BY_ID, getRefundSetting);

// ? API to update refund settings
router.put(refundSettingAPI.UPDATE_BY_ID, authenticateToken, updateRefundSetting);

module.exports = router;

