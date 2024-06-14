const express = require('express');
const { orderItemAPI } = require('../utils/api_constant');
const {
  createNewProductItem,
  getProductItem,
  getProductByID,
  updateProductItemByID,
  cancelBatchProductItemById,
} = require('../services/order_item_services');

const router = express.Router();

// ? API to create product item
router.post(orderItemAPI.CREATE, createNewProductItem);

// ? API to get products using querystring
router.get(orderItemAPI.GET_ALL, getProductItem);

// ? API to get product by ID
router.get(orderItemAPI.GET_BY_ID, getProductByID);

// ? API to update a product by ID
router.put(orderItemAPI.UPDATE_BY_ID, updateProductItemByID);

// ? API to cancel batch products by ID
router.put(orderItemAPI.CANCEL_BATCH, cancelBatchProductItemById);

module.exports = router;