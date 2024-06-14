const mongoose = require("mongoose");

const wishlistItemSchema = mongoose.Schema(
  {
    wishlist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wishlist',
      default: null
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      autopopulate: { maxDepth: 2 },
    },
  },
  {
    timestamps: true,
  }
);

wishlistItemSchema.plugin(require("mongoose-autopopulate"));
const WishlistItem = mongoose.model("WishlistItem", wishlistItemSchema);
module.exports = WishlistItem;
