const express = require('express');
const router = express.Router();
const { addressAPI } = require('../utils/api_constant');
const {
  createAddress,
  getAllAddresses,
  getAddressByID,
  updateAddressByID,
  deleteAddressByID,
} = require('../services/address_services');
const { authenticateToken } = require('../middlewares/token_authenticator');

// ? API to create an address
router.post(addressAPI.CREATE, authenticateToken, createAddress);

// ? API to get all address using query string
router.get(addressAPI.GET_ALL, getAllAddresses);

// ? API to get an address by ID
router.get(addressAPI.GET_BY_ID, getAddressByID);

// ? API to update an address by ID
router.put(addressAPI.UPDATE_BY_ID, authenticateToken, updateAddressByID);

// ? API to delete an address by ID
router.delete(addressAPI.DELETE_BY_ID, authenticateToken, deleteAddressByID);

module.exports = router;