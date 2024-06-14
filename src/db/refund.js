const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const refundSchema = mongoose.Schema(
  {
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
      intl: true,
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted']
    },
    canceled: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: 0
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
      autopopulate: { maxDepth: 1 }
    }
  }, {
    timestamps: true,
  }
);

refundSchema.plugin(require('mongoose-autopopulate'));
mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const Refund = mongoose.model('Refund', refundSchema);
module.exports = Refund;