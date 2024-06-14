const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          autopopulate: { maxDepth: 2 },
        }
      ],
      default: []
    }
  }, {
    timestamps: true,
  }
);

wishlistSchema.plugin(require('mongoose-autopopulate'));
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;