const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const productItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      intl: true,
    },
    price: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      default: 0
    },
    total_price: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: ''
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
      autopopulate: { maxDepth: 2 }
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
      autopopulate: { maxDepth: 2 },
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
      autopopulate: { maxDepth: 2 },
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipping', 'delivered', 'in-dispute', 'disputed', 'canceled'],
      default: 'pending',
    },
    product_varient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariation',
      default: null,
      autopopulate: { maxDepth: 2 },
    },
    canceled: {
      type: Boolean,
      default: false,
    },
    ordered: {
      type: Boolean,
      default: false,
    },
    disputed: {
      type: Boolean,
      default: false,
    },
    order_date: {
      type: Date,
      default: null,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    }
  }, {
    timestamps: true
  }
);

productItemSchema.plugin(require('mongoose-autopopulate'));
mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const ProductItem = mongoose.model('ProductItem', productItemSchema);
module.exports = ProductItem;