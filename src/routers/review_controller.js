const express = require("express");
const { body } = require("express-validator");
const { reviewAPI } = require("../utils/api_constant");
const {
  createReview,
  getAllReviews,
  getReviewByID,
  updateReviewByID,
  deleteReviewByID,
  setFlagByID,
} = require("../services/review_services");
const { authenticateToken } = require("../middlewares/token_authenticator");

const router = express.Router();

// ? API to create a review
router.post(reviewAPI.CREATE, authenticateToken, createReview);

// ? API to get reviews using querystring
router.get(reviewAPI.GET_ALL, getAllReviews);

// ? API to get a review using ID
router.get(reviewAPI.GET_BY_ID, getReviewByID);

// ? API to update a review using ID
router.put(reviewAPI.UPDATE_BY_ID, authenticateToken, updateReviewByID);

// ? API to delete a review using ID
router.delete(reviewAPI.DELETE_BY_ID, authenticateToken, deleteReviewByID);

// ? API to set flag by ID
router.put(reviewAPI.SET_FLAG_BY_ID, authenticateToken, setFlagByID);

module.exports = router;