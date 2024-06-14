const express = require('express');
const { customerOrderAPI } = require('../utils/api_constant');
const { authenticateToken } = require('../middlewares/token_authenticator');
const {
  createOrder,
  getOrders,
  getOrdersByID,
  updateOrderByID,
  deleteOrderByID,
  getInfos,
} = require('../services/customer_order_services');

const router = express.Router();

// ? API to create a order for a customer
router.post(customerOrderAPI.CREATE, createOrder);

// ? API to get all orders for a customer
router.get(customerOrderAPI.GET_ALL, getOrders);

// ? API to get a order for a customer by ID
router.get(customerOrderAPI.GET_BY_ID, getOrdersByID);

// ? API to update a order for a customer by ID
router.put(customerOrderAPI.UPDATE_BY_ID, updateOrderByID);

// ? API to delete a order for a customer by ID
router.delete(customerOrderAPI.DELETE_BY_ID, deleteOrderByID);

// ? API to get count of wishlist and order
router.get(customerOrderAPI.GET_INFOS, authenticateToken, getInfos);

module.exports = router;
