const mongoose = require("mongoose");
const mongooseIntl = require("mongoose-intl");

const productVariationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      intl: true,
    },
    description: {
      type: String,
      intl: true,
    },
    sku: {
      type: String,
    },
    attributes: [
      {
        attribute: {
          type: String,
        },
        value: {
          type: String,
        },
      },
    ],
    images: {
      type: [
        {
          type: String,
        },
      ],
    },
    color: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    on_sale: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sales_price: {
      type: Number,
    },
    bulk_prices: {
      type: [
        {
          low_range: {
            type: Number,
          },
          high_range: {
            type: Number,
          },
          price: {
            type: Number,
          },
        },
      ],
    },
    allow_bulk: {
      type: Boolean,
      default: false,
    },
    track_stock: {
      type: Boolean,
      default: true,
    },
    minimum_order: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    low_stock_threshold: {
      type: Number,
    },
    dimentions: {
      type: {
        width: {
          type: Number,
        },
        height: {
          type: Number,
        },
        length: {
          type: Number,
        },
        weight: {
          type: Number,
        },
        length_unit: {
          type: String,
        },
        width_unit: {
          type: String,
        },
        height_unit: {
          type: String,
        },
        weight_unit: {
          type: String,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

productVariationSchema.plugin(require("mongoose-autopopulate"));
mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const ProductVariation = mongoose.model(
  "ProductVariation",
  productVariationSchema
);
module.exports = ProductVariation;
