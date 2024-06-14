const express = require('express');
const { topBarDataAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createTopBarData,
  getTopBarData,
  getTopBarDataByID,
  updateTopBarDataByID,
  deleteTopBarDataByID,
} = require('../services/top_bar_data_services');

const router = express.Router();

// ? API to create top bar data
router.post(topBarDataAPI.CREATE, authenticateToken, createTopBarData);

// ? API to get top bar data using querystring
router.get(topBarDataAPI.GET_ALL, getTopBarData);

// ? API to get top bar data using ID
router.get(topBarDataAPI.GET_BY_ID, getTopBarDataByID);

// ? API to update top bar data using ID
router.put(topBarDataAPI.UPDATE_BY_ID, authenticateToken, updateTopBarDataByID);

// ? API to delete top bar data using ID
router.delete(topBarDataAPI.DELETE_BY_ID, authenticateToken, deleteTopBarDataByID);

module.exports = router;