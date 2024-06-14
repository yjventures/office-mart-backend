const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model(
  "Brand",
  brandSchema
);
module.exports = Brand;