const express = require('express');
const { motivationBoxDataAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createMotivationBoxData,
  getMotivationBoxData,
  getMotivationBoxDataByID,
  updateMotivationBoxDataByID,
  deleteMotivationBoxDataByID,
} = require('../services/motivation_box_data_services');

const router = express.Router();

// ? API to create motivation box data
router.post(motivationBoxDataAPI.CREATE, authenticateToken, createMotivationBoxData);

// ? API to get motivation box data using querystring
router.get(motivationBoxDataAPI.GET_ALL, getMotivationBoxData);

// ? API to get motivation box data using ID
router.get(motivationBoxDataAPI.GET_BY_ID, getMotivationBoxDataByID);

// ? API to update motivation box data using ID
router.put(motivationBoxDataAPI.UPDATE_BY_ID, authenticateToken, updateMotivationBoxDataByID);

// ? API to delete motivation box data using ID
router.delete(motivationBoxDataAPI.DELETE_BY_ID, authenticateToken, deleteMotivationBoxDataByID);

module.exports = router;