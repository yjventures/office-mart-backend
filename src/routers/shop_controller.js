const express = require('express');
const { body } = require("express-validator");
const router = express.Router();
const { 
  createShopInfo,
  getAllShopInfo,
  getShopInfoByID,
  updateShopInfoByID,
  deleteShopByID, 
  findUserByShopID,
} = require('../services/shop_services');
const { shopAPI } = require('../utils/api_constant');

// ? API to create a shop
router.post(shopAPI.CREATE,[
  body('name', 'Name is required').notEmpty()
], createShopInfo);

// ? API to get all shop using querystring
router.get(shopAPI.GET_ALL, getAllShopInfo);

// ? API to get shop by ID
router.get(shopAPI.GET_BY_ID, getShopInfoByID);

// ? API to update shop by ID
router.put(shopAPI.UPDATE_BY_ID, updateShopInfoByID);

// ? API to delete shop by ID
router.delete(shopAPI.DELETE_BY_ID, deleteShopByID);

// ? API to get user by shop ID
router.post(shopAPI.GET_USER,[
  body('shop', 'Shop is required').notEmpty()
], findUserByShopID);

module.exports = router;