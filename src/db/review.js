const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
      autopopulate: { maxDepth: 1 },
    },
    product_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductItem',
      default: null,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      autopopulate: { maxDepth: 2 },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    feedback: {
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
    publish: {
      type: Boolean,
      default: false,
    },
    flag: {
      type: Boolean,
      default: false,
    }
  }, {
    timestamps: true
});

reviewSchema.plugin(require('mongoose-autopopulate'));
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;