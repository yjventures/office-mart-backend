const express = require("express");
const { body } = require("express-validator");
const { disputeAPI } = require("../utils/api_constant");
const {
  createDispute,
  createBatchDispute,
  getAllDisputes,
  getDisputeByID,
  updateDisputeByID,
  deleteDisputeByID,
  disputeProductByID,
} = require("../services/dispute_services");
const { authenticateToken } = require("../middlewares/token_authenticator");

const router = express.Router();

//? API to create a dispute
router.post(
  disputeAPI.CREATE,
  authenticateToken,
  [
    body("reason", "Reason is required").notEmpty(),
    body("order", "Order is required").notEmpty(),
    body("shop", "Shop is required").notEmpty(),
  ],
  createDispute
);

//? API to create a dispute
router.post(
  disputeAPI.CREATE_BATCH,
  authenticateToken,
  [
    body("reason", "Reason is required").notEmpty(),
    body("order", "Order is required").notEmpty(),
    body("product_items", "Product_items is required").notEmpty(),
  ],
  createBatchDispute
);

// ? API to find dispute using querystring
router.get(disputeAPI.GET_ALL, authenticateToken, getAllDisputes);

// ? API to find dispute using ID
router.get(disputeAPI.GET_BY_ID, authenticateToken, getDisputeByID);

// ? API to update dispute using ID
router.put(disputeAPI.UPDATE_BY_ID, authenticateToken, updateDisputeByID);

//? API to delete dispute using ID
router.delete(disputeAPI.DELETE_BY_ID, authenticateToken, deleteDisputeByID);

// ? API to dispute a product using ID
router.put(disputeAPI.DISPUTE_BY_ID, authenticateToken, disputeProductByID);

module.exports = router;