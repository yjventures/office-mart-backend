const express = require('express');
const { customOrderAPI } = require('../utils/api_constant');
const {
  createCustomOrder,
  getAllCustomOrder,
  getCustomOrderByID,
  updateCustomOrderByID,
  deleteCustomOrderByID,
} = require('../services/custom_order_services');

const router = express.Router();

// ? API to create a custom order
router.post(customOrderAPI.CREATE, createCustomOrder);

// ? API to get all custom orders
router.get(customOrderAPI.GET_ALL, getAllCustomOrder);

// ? API to get a custom order by id
router.get(customOrderAPI.GET_BY_ID, getCustomOrderByID);

// ? API to update a custom order by id
router.put(customOrderAPI.UPDATE_BY_ID, updateCustomOrderByID);

// ? API to delete a custom order by id
router.delete(customOrderAPI.DELETE_BY_ID, deleteCustomOrderByID);

module.exports = router;
