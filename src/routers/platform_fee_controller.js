const express = require('express');
const router = express.Router();
const {
  createPlatformFee,
  getAllPlatformFees,
  getPlatformFeeByID,
  updatePlatformFeeByID,
  deletePlatformFeeByID,
} = require("../services/platform_fee_services");
const { platformFeeAPI } = require("../utils/api_constant");
const { authenticateToken } = require("../middlewares/token_authenticator");

// ? API to create support ticket
router.post(platformFeeAPI.CREATE, authenticateToken, createPlatformFee);

// ? API to get all support ticket
router.get(platformFeeAPI.GET_ALL, getAllPlatformFees);

// ? API to get a support ticket by ID
router.get(platformFeeAPI.GET_BY_ID, getPlatformFeeByID);

// ? API to Update a support ticket by ID
router.put(platformFeeAPI.UPDATE_BY_ID, authenticateToken, updatePlatformFeeByID);

// ? API to Delete a support ticket by ID
router.delete(platformFeeAPI.DELETE_BY_ID, authenticateToken, deletePlatformFeeByID);

module.exports = router;