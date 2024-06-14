const express = require('express');
const router = express.Router();
const { brandAPI } = require('../utils/api_constant');
const {
  createBrand,
  getAllBrands,
  getBrandByID,
  updateBrandByID,
  deleteBrandByID,
} = require('../services/brand_services');
const { authenticateToken } = require('../middlewares/token_authenticator');

// ? API to create a brand
router.post(brandAPI.CREATE, authenticateToken, createBrand);

// ? API to get all brand using query string
router.get(brandAPI.GET_ALL, getAllBrands);

// ? API to get a brand by ID
router.get(brandAPI.GET_BY_ID, getBrandByID);

// ? API to update a brand by ID
router.put(brandAPI.UPDATE_BY_ID, authenticateToken, updateBrandByID);

// ? API to delete a brand by ID
router.delete(brandAPI.DELETE_BY_ID, authenticateToken, deleteBrandByID);

module.exports = router;