const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    unique_token: {
      type: String,
      default: '',
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    billing_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    items: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ProductItem',
          autopopulate: { maxDepth: 1 },
        }
      ], 
      default: []
    },
    sub_total: {
      type: Number,
      default: 0,
    },
    platform_amount: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      default: '',
    },
    is_card_authorized: {
      type: Boolean,
      default: false,
    },
    canceled: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipping', 'delevered'],
      default: 'pending',
    },
    payment_status: {
      type: String,
      default: '',
    },
    payment_method: {
      type: String,
      default: '',
    },
    creation_date: {
      type: Date,
      default: Date.now(),
    },
    estimation_date: {
      type: Date,
      default: null,
    },
    is_custom_order: {
      type: Boolean,
      default: false,
    },
    ordered: {
      type: Boolean,
      default: false,
    }
  }, {
    timestamps: true
  }
);

orderItemSchema.plugin(require('mongoose-autopopulate'));
const Order = mongoose.model('Order', orderItemSchema);
module.exports = Order;