const mongoose = require('mongoose');

const customOrderItemSchema = mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: { maxDepth: 2 }
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'canceled'],
      default: 'pending',
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      autopopulate: { maxDepth: 4 }
    }
  }, {
    timestamps: true
  }
);

customOrderItemSchema.plugin(require('mongoose-autopopulate'));
const CustomOrder = mongoose.model('CustomOrder', customOrderItemSchema);
module.exports = CustomOrder;