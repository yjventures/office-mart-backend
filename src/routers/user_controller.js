const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
require('dotenv').config();
const { userAPI } = require("../utils/api_constant");
const {
  createUser,
  getUserByID,
  getAllUser,
  updateUserByID,
  deleteUserByID,
  forgetPassword,
  verifyOtp,
  resetPassword,
} = require("../services/user_services");
const { authenticateToken } = require("../middlewares/token_authenticator");

// ? API to sign in
router.post(
  userAPI.CREATE,
  [
    body("firstname", "firstname is required").notEmpty(),
    body("lastname", "lastname is required").notEmpty(),
    body("email", "Please enter a valid email").notEmpty().isEmail(),
    body("password", "Please enter at least 8 digits").isLength({ min: 8 }),
  ],
  createUser
);

// ? API to get all user using querystring
router.get(userAPI.GET_ALL, getAllUser);

// ? API to get user by ID
router.get(userAPI.GET_BY_ID, getUserByID);

// ? API to update user by ID
router.put(userAPI.UPDATE_BY_ID, authenticateToken, updateUserByID);

// ? API to delete user by ID
router.delete(userAPI.DELETE_BY_ID, authenticateToken, deleteUserByID);

// ? API to forget password
router.post(
  userAPI.FORGET_PASSWORD,
  [body("email", "Please enter a valid email").notEmpty().isEmail()],
  forgetPassword
);

// ? API to reset password
router.put(
  userAPI.RESET_PASSWORD,
  [
    body("password", "Please enter at least 8 digits").isLength({ min: 8 }),
    body("userId", "User ID is required").notEmpty(),
  ],
  resetPassword
);

// ? API to verify otp
router.post(
  userAPI.VERIFY,
  [
    body("email", "Please enter a valid email").notEmpty().isEmail(),
    body("code", "code is required").notEmpty(),
  ],
  verifyOtp
);

module.exports = router;
