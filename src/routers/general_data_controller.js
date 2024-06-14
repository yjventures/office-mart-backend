const express = require('express');
const { generalDataAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createGeneralData,
  getGeneralData,
  getGeneralDataByID,
  updateGeneralDataByID,
  deleteGeneralDataByID,
} = require('../services/general_data_services');

const router = express.Router();

// ? API to create general data
router.post(generalDataAPI.CREATE, authenticateToken, createGeneralData);

// ? API to get general data using querystring
router.get(generalDataAPI.GET_ALL, getGeneralData);

// ? API to get general data using ID
router.get(generalDataAPI.GET_BY_ID, getGeneralDataByID);

// ? API to update general data using ID
router.put(generalDataAPI.UPDATE_BY_ID, authenticateToken, updateGeneralDataByID);

// ? API to delete general data using ID
router.delete(generalDataAPI.DELETE_BY_ID, authenticateToken, deleteGeneralDataByID);

module.exports = router;