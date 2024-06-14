const express = require('express');
const { socialLinkAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createSocialLinkData,
  getSocialLinkData,
  getSocialLinkDataByID,
  updateSocialLinkDataByID,
  deleteSocialLinkDataByID,
} = require('../services/social_links_services');

const router = express.Router();

// ? API to create social link data
router.post(socialLinkAPI.CREATE, authenticateToken, createSocialLinkData);

// ? API to get social link data using querystring
router.get(socialLinkAPI.GET_ALL, getSocialLinkData);

// ? API to get social link data using ID
router.get(socialLinkAPI.GET_BY_ID, getSocialLinkDataByID);

// ? API to update social link data using ID
router.put(socialLinkAPI.UPDATE_BY_ID, authenticateToken, updateSocialLinkDataByID);

// ? API to delete social link data using ID
router.delete(socialLinkAPI.DELETE_BY_ID, authenticateToken, deleteSocialLinkDataByID);

module.exports = router;