const express = require('express');
const { shippingAndVatAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");
const {
  createShippingAndVatData,
  getShippingAndVatData,
  getShippingAndVatDataByID,
  updateShippingAndVatDataByID,
  deleteShippingAndVatDataByID,
} = require('../services/shipping_and_vat_services');

const router = express.Router();

// ? API to create shipping and vat
router.post(shippingAndVatAPI.CREATE, authenticateToken, createShippingAndVatData);

// ? API to get shipping and vat using querystring
router.get(shippingAndVatAPI.GET_ALL, getShippingAndVatData);

// ? API to get shipping and vat using ID
router.get(shippingAndVatAPI.GET_BY_ID, getShippingAndVatDataByID);

// ? API to update shipping and vat using ID
router.put(shippingAndVatAPI.UPDATE_BY_ID, authenticateToken, updateShippingAndVatDataByID);

// ? API to delete shipping and vat using ID
router.delete(shippingAndVatAPI.DELETE_BY_ID, authenticateToken, deleteShippingAndVatDataByID);

module.exports = router;