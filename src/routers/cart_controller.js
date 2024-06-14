const express = require('express');
const { cartAPI } = require('../utils/api_constant');
const {
  getCartByUserID,
  addProductInCart,
  deleteProductInCart,
  updateProductInCart,
  clearCart,
  getCartByToken,
  clearCartGhost,
  addProductInCartByToken,
  deleteProductInCartByToken,
  updateProductInCartByToken,
} = require('../services/cart_services');

const router = express.Router();

// ? API to get card using user ID
router.get(cartAPI.GET_BY_ID, getCartByUserID);

// ? API to get card using user ID
router.get(cartAPI.GET_BY_TOKEN, getCartByToken);

// ? API to add product to cart
router.put(cartAPI.ADD_PRODUCT, addProductInCart);

// ? API to add product to cart by token
router.put(cartAPI.ADD_PRODUCT_BY_TOKEN, addProductInCartByToken);

// ? API to delete product from cart
router.put(cartAPI.DELETE_PRODUCT, deleteProductInCart);

// ? API to delete product from cart by token
router.put(cartAPI.DELETE_PRODUCT_BY_TOKEN, deleteProductInCartByToken);

// ? API to update product in cart
router.put(cartAPI.UPDATE_PRODUCT, updateProductInCart);

// ? API to update product in cart by token
router.put(cartAPI.UPDATE_PRODUCT_BY_TOKEN, updateProductInCartByToken);

// ? API to clear all products from cart
router.delete(cartAPI.CLEAR_CART, clearCart);

// ? API to clear all products from cart for ghost accounts
router.delete(cartAPI.CLEAR_CART_BY_TOKEN, clearCartGhost);

module.exports = router;
