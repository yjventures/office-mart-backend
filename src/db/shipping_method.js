const mongoose = require("mongoose");

const shippingMethodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      intl: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ShippingMethod = mongoose.model(
  "ShippingMethod",
  shippingMethodSchema
);
module.exports = ShippingMethod;
