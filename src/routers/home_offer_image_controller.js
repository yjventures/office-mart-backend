const express = require('express');
const { homeOfferImageAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createHomeOfferImage,
  getHomeOfferImage,
  getHomeOfferImageByID,
  updateHomeOfferImageByID,
  deleteHomeOfferImageByID,
} = require('../services/home_offer_image_services');

const router = express.Router();

// ? API to create home offer image
router.post(homeOfferImageAPI.CREATE, authenticateToken, createHomeOfferImage);

// ? API to get home offer image using querystring
router.get(homeOfferImageAPI.GET_ALL, getHomeOfferImage);

// ? API to get home offer image using ID
router.get(homeOfferImageAPI.GET_BY_ID, getHomeOfferImageByID);

// ? API to update home offer image using ID
router.put(homeOfferImageAPI.UPDATE_BY_ID, authenticateToken, updateHomeOfferImageByID);

// ? API to delete home offer image using ID
router.delete(homeOfferImageAPI.DELETE_BY_ID, authenticateToken, deleteHomeOfferImageByID);

module.exports = router;