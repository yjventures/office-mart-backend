const express = require('express');
const router = express.Router();
const { categoryAPI } = require('../utils/api_constant');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoryByParentId,
} = require('../services/child_category_services');
const { authenticateToken } = require('../middlewares/token_authenticator');

// ? API to create a catagory
router.post(categoryAPI.CREATE, authenticateToken, createCategory);

// ? API to get all categories
router.get(categoryAPI.GET_ALL, getAllCategories);

// ? API to get a category by ID
router.get(categoryAPI.GET_BY_ID, getCategoryById);

// ? API to update a category by ID
router.put(categoryAPI.UPDATE_BY_ID, authenticateToken, updateCategoryById);

// ? API to delete a category by ID
router.delete(categoryAPI.DELETE_BY_ID, authenticateToken, deleteCategoryById);

// ? API to get categories using parent ID
router.get(categoryAPI.GET_BY_PARENT, authenticateToken, getCategoryByParentId);

module.exports = router;