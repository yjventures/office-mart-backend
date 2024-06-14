const mongoose = require('mongoose');

const disputeSchema = mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    product_item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductItem',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    reason: {
      type: String,
      default: '',
    },
    detail: {
      type: String,
      default: '',
    },
    images: {
      type: [
        {
          type: String,
        }
      ],
      default: [],
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted']
    },
    canceled: {
      type: Boolean,
      default: false,
    }
  }, {
    timestamps: true,
});

disputeSchema.plugin(require('mongoose-autopopulate'));
const Dispute = mongoose.model('Dispute', disputeSchema);
module.exports = Dispute;