const mongoose = require('mongoose');

const shippingAndVatSchema = mongoose.Schema(
  {
    area: {
      type: String,
      default: ''
    },
    shipping_charge: {
      type: String,
      default: ''
    },
    vat: {
      type: Number,
      default: 0
    },
  }, {
    timestamps: true,
  }
);

const ShippingAndVat = mongoose.model('ShippingAndVat', shippingAndVatSchema);
module.exports = ShippingAndVat;