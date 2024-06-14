const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { userAPI } = require('../utils/api_constant');
const {
  createVendorInfo,
  getAllVendorInfo,
  getVendorInfoByID,
  updateVendorInfoByID,
  deleteVendorInfoByID,
} = require('../services/vendor_info_services');
const { authenticateToken } = require('../middlewares/token_authenticator');

// ? API to onboarding vendor information
router.post(
  userAPI.CREATE,
  [
      body('business_name', 'business_name is required').notEmpty(),
      body('business_reg_number', 'business_reg_number is required').notEmpty(),
      body('business_email', 'business_email is required').notEmpty(),
      body('business_phone_no', 'business_phone_no is required').notEmpty(),
      body('userId', 'userId is required').notEmpty(),
  ],
  createVendorInfo
);

// ? API to get all vendor
router.get(userAPI.GET_ALL, authenticateToken, getAllVendorInfo);

// ? API to get vendor by ID
router.get(userAPI.GET_BY_ID, authenticateToken, getVendorInfoByID);

// ? API to update user by ID
router.put(userAPI.UPDATE_BY_ID, authenticateToken, updateVendorInfoByID);

// ? API to delete user by ID
router.delete(userAPI.DELETE_BY_ID, authenticateToken, deleteVendorInfoByID);

module.exports = router;