const mongoose = require('mongoose');

const favouriteShopSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
      autopopulate: { maxDepth: 1 }
    },
  }, {
    timestamps: true,
  }
);

favouriteShopSchema.plugin(require('mongoose-autopopulate'));
const FavouriteShop = mongoose.model('FavouriteShop', favouriteShopSchema);
module.exports = FavouriteShop;