const express = require('express');
const { footerDataAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createFooterData,
  getFooterData,
  getFooterDataByID,
  updateFooterDataByID,
  deleteFooterDataByID,
} = require('../services/footer_data_services');

const router = express.Router();

// ? API to create footer data
router.post(footerDataAPI.CREATE, authenticateToken, createFooterData);

// ? API to get footer data using querystring
router.get(footerDataAPI.GET_ALL, getFooterData);

// ? API to get footer data using ID
router.get(footerDataAPI.GET_BY_ID, getFooterDataByID);

// ? API to update footer data using ID
router.put(footerDataAPI.UPDATE_BY_ID, authenticateToken, updateFooterDataByID);

// ? API to delete footer data using ID
router.delete(footerDataAPI.DELETE_BY_ID, authenticateToken, deleteFooterDataByID);

module.exports = router;