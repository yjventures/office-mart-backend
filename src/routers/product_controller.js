const express = require('express');
const { body } = require("express-validator");
const router = express.Router();
const { setPathForUploader } = require("../middlewares/file_uploader");
const { 
  createProductInfo,
  getAllProductInfo,
  getProductInfoByID,
  updateProductInfoByID,
  deleteProductInfoByID,
  filterProduct,
  productBulkUpload,
  deleteVariationsByID,
  addVariationsByID,
  getTopProducts,
} = require('../services/product_service');
const { productAPI } = require('../utils/api_constant');
const { process_query } = require('../middlewares/process_query');

const upload = setPathForUploader();

// ? API to create a product
router.post(productAPI.CREATE,[
  body('name', 'Name is required').notEmpty()
], createProductInfo);

// ? API to get all shop using querystring
router.get(productAPI.GET_ALL, process_query, getAllProductInfo);

// ? API to get shop by ID
router.get(productAPI.GET_BY_ID, getProductInfoByID);

// ? API to update shop by ID
router.put(productAPI.UPDATE_BY_ID, updateProductInfoByID);

// ? API to delete shop by ID
router.delete(productAPI.DELETE_BY_ID, deleteProductInfoByID);

// ? API to search products by filter
router.post(productAPI.SEARCH_BY_FILTERS, filterProduct);

// ? API to bulk upload products
router.post(productAPI.BULK_UPLOAD, upload.single('file'), productBulkUpload);

// ? API to delete variations of products by ID
router.delete(productAPI.DELETE_VARIATIONS, deleteVariationsByID);

// ? API to add variations of products by ID
router.put(productAPI.ADD_VARIATIONS, addVariationsByID);

// ? API to get top products
router.get(productAPI.GET_TOP_PRODUCTS, getTopProducts);

module.exports = router;