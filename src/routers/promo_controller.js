const express = require('express');
const {
  createPromo,
  applyPromo,
} = require('../services/promo_services');
const { promoAPI } = require('../utils/api_constant');

const router = express.Router();

router.post(promoAPI.CREATE, createPromo);

router.post(promoAPI.APPLY, applyPromo);

module.exports = router;