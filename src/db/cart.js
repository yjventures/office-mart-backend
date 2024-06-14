const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    unique_token: {
      type: String,
    },
    items: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ProductItem',
          autopopulate: {maxDepth: 3}
        }
      ]
    },
    total_price: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      default: '',
    },
    sub_total: {
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
    }
  }, {
    timestamps: true
  }
);

cartItemSchema.plugin(require('mongoose-autopopulate'));
const CartItem = mongoose.model('Cart', cartItemSchema);
module.exports = CartItem;