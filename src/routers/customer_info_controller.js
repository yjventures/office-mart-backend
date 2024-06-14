const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { userAPI } = require('../utils/api_constant');
const {
  createCustomerInfo,
  getAllCustomerInfo,
  getCustomerInfoByID,
  updateCustomerInfoByID,
  deleteCustomerInfoByID,
} = require('../services/customer_info_services');
const { authenticateToken } = require('../middlewares/token_authenticator');

// ? API to onboarding vendor information
router.post(
  userAPI.CREATE,
  [
      body('billing_address', 'home_address is required').notEmpty(),
      body('shipping_address', 'shipping_address is required').notEmpty(),
      body('userId', 'userId is required').notEmpty(),
  ],
  createCustomerInfo
);

// ? API to get all vendor
router.get(userAPI.GET_ALL, authenticateToken, getAllCustomerInfo);

// ? API to get vendor by ID
router.get(userAPI.GET_BY_ID, authenticateToken, getCustomerInfoByID);

// ? API to update user by ID
router.put(userAPI.UPDATE_BY_ID, authenticateToken, updateCustomerInfoByID);

// ? API to delete user by ID
router.delete(userAPI.DELETE_BY_ID, authenticateToken, deleteCustomerInfoByID);

module.exports = router;