const express = require("express");
const { body } = require("express-validator");
const { refundAPI } = require("../utils/api_constant");
const {
  createRefund,
  getAllRefund,
  getRefundByID,
  updateRefundByID,
  deleteRefundByID,
  createBatchRefund,
} = require("../services/refund_services");
const { authenticateToken } = require("../middlewares/token_authenticator");

const router = express.Router();

//? API to create a refund
router.post(
  refundAPI.CREATE,
  authenticateToken,
  [
    body("reason", "Reason is required").notEmpty(),
    body("order", "Order is required").notEmpty(),
    body("shop", "Shop is required").notEmpty(),
  ],
  createRefund
);

//? API to create a refund
router.post(
  refundAPI.CREATE_BATCH,
  authenticateToken,
  [
    body("reason", "Reason is required").notEmpty(),
    body("order", "Order is required").notEmpty(),
    body("product_items", "Product_items is required").notEmpty(),
  ],
  createBatchRefund
);

// ? API to find refunds using querystring
router.get(refundAPI.GET_ALL, authenticateToken, getAllRefund);

// ? API to find refunds using ID
router.get(refundAPI.GET_BY_ID, authenticateToken, getRefundByID);

// ? API to update refund using ID
router.put(refundAPI.UPDATE_BY_ID, authenticateToken, updateRefundByID);

//? API to delete refund using ID
router.delete(refundAPI.DELETE_BY_ID, authenticateToken, deleteRefundByID);

module.exports = router;