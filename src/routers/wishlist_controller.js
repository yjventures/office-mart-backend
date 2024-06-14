const express = require('express');
const router = express.Router();
const {
  getWishlistByID,
  addWishlistProductByID,
  deleteWishlistProductByID,
  clearWishlist,
} = require('../services/wishlist_services');
const { wishlistAPI } = require('../utils/api_constant');
const { authenticateToken } = require("../middlewares/token_authenticator");

// ? API to get wishlist using an ID
router.get(wishlistAPI.GET_BY_ID, authenticateToken, getWishlistByID);

// ? API to add a product to wishlist
router.put(wishlistAPI.ADD_PRODUCT, authenticateToken, addWishlistProductByID);

// ? API to remove a product from wishlist
router.put(wishlistAPI.DELETE_PRODUCT, authenticateToken, deleteWishlistProductByID);

// ? API to clear wishlist by user ID
router.delete(wishlistAPI.CLEAR_WISHLIST, authenticateToken, clearWishlist);

module.exports = router;