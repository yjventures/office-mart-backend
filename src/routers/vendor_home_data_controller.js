const express = require('express');
const { VendorHomeDataAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createVendorHomeData,
  getVendorHomeData,
  getVendorHomeDataByID,
  updateVendorHomeDataByID,
  deleteVendorHomeDataByID,
} = require('../services/vendor_home_data_services');

const router = express.Router();

// ? API to create home offer image
router.post(VendorHomeDataAPI.CREATE, authenticateToken, createVendorHomeData);

// ? API to get home offer image using querystring
router.get(VendorHomeDataAPI.GET_ALL, getVendorHomeData);

// ? API to get home offer image using ID
router.get(VendorHomeDataAPI.GET_BY_ID, getVendorHomeDataByID);

// ? API to update home offer image using ID
router.put(VendorHomeDataAPI.UPDATE_BY_ID, authenticateToken, updateVendorHomeDataByID);

// ? API to delete home offer image using ID
router.delete(VendorHomeDataAPI.DELETE_BY_ID, authenticateToken, deleteVendorHomeDataByID);

module.exports = router;