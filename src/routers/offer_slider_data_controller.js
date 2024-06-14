const express = require('express');
const { offerSliderDataAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createOfferSliderData,
  getOfferSliderData,
  getOfferSliderDataByID,
  updateOfferSliderDataByID,
  deleteOfferSliderDataByID,
} = require('../services/offer_slider_data_services');

const router = express.Router();

// ? API to create offer slider data
router.post(offerSliderDataAPI.CREATE, authenticateToken, createOfferSliderData);

// ? API to get offer slider data using querystring
router.get(offerSliderDataAPI.GET_ALL, getOfferSliderData);

// ? API to get offer slider data using ID
router.get(offerSliderDataAPI.GET_BY_ID, getOfferSliderDataByID);

// ? API to update offer slider data using ID
router.put(offerSliderDataAPI.UPDATE_BY_ID, authenticateToken, updateOfferSliderDataByID);

// ? API to delete offer slider data using ID
router.delete(offerSliderDataAPI.DELETE_BY_ID, authenticateToken, deleteOfferSliderDataByID);

module.exports = router;