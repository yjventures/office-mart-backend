const express = require('express');
const router = express.Router();
const {
  createFavouriteShop,
  getFavoriteShopList,
} = require('../services/favourite_shop_services');
const { favouriteShopAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");

// ? API to create or delete a favourite shop
router.post(favouriteShopAPI.CREATE, authenticateToken, createFavouriteShop);

// ? API to get list of favourite shops using user ID
router.get(favouriteShopAPI.GET_BY_ID, authenticateToken, getFavoriteShopList);

module.exports = router;