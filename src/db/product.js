const mongoose = require("mongoose");
const mongooseIntl = require("mongoose-intl");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      intl: true,
      default: '',
    },
    description: {
      type: String,
      intl: true,
      default: '',
    },
    brand: {
      type: String,
      default: '',
    },
    images: {
      type: [
        {
          type: String,
        }
      ],
      deafult: [],
    },
    price: {
      type: Number,
      default: 0,
    },
    color: {
      type: [
        {
          type: String,
        }
      ],
      default: [],
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
      default: 0,
    },
    main_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellingCategory',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    tags: {
      type: [
        {
          type: String,
        }
      ],
      default: [],
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
      default: [],
    },
    allow_bulk: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      default: '',
    },
    track_stock: {
      type: Boolean,
      default: true,
    },
    draft: {
      type: Boolean,
      default: false,
    },     
    is_published: {
      type: Boolean,
      default: false,
    },
    minimum_order: {
      type: Number,
      default: 1,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    low_stock_threshold: {
      type: Number,
      default: 5,
    },
    dimentions: {
      type: {
        width: {
          type: Number,
          default: 0,
        },
        height: {
          type: Number,
          default: 0,
        },
        length: {
          type: Number,
          default: 0,
        },
        weight: {
          type: Number,
          default: 0,
        },
        length_unit: {
          type: String,
          default: ''
        },
        width_unit: {
          type: String,
          default: '',
        },
        height_unit: {
          type: String,
          default: '',
        },
        weight_unit: {
          type: String,
          default: '',
        }
      }
    },
    variations: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ProductVariation',
          autopopulate: { maxDepth: 2 },
        }
      ],
      default: [],
    },
    related_products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        }
      ],
      default: [],
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    weight_matrics: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    view: {
      type: Number,
      default: 0,
    },
    order_matrics: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(require("mongoose-autopopulate"));
mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
