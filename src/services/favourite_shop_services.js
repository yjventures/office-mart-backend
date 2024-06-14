const FavouriteShop = require("../db/favourite_shop");

// * Function to create a favourite shop
const createFavouriteShop = async (req, res) => {
  try {
    const favoriteShopObj = {};
    for (let item in req?.body) {
      favoriteShopObj[item] = req?.body[item];
    }
    const favoriteShop = await FavouriteShop.findOne(favoriteShopObj).lean();
    if (favoriteShop) {
      const favourite_shop = await FavouriteShop.findByIdAndDelete(
        favoriteShop._id
      );
      if (favourite_shop) {
        const favourite_shop_list = await FavouriteShop.find({
          user_id: req?.body?.user_id,
        });
        if (favourite_shop_list) {
          res.status(200).json({ favourite_shop_list });
        } else {
          res.status(404).json({ message: "No favourite shop found" });
        }
      } else {
        res.status(400).json({ message: "Favourite shop not deleted" });
      }
    } else {
      const favourite_shop_collection = await new FavouriteShop(
        favoriteShopObj
      );
      const favourite_shop = await favourite_shop_collection.save();
      if (favourite_shop) {
        const favourite_shop_list = await FavouriteShop.find({
          user_id: req?.body?.user_id,
        });
        if (favourite_shop_list) {
          res.status(200).json({ favourite_shop_list });
        } else {
          res.status(404).json({ message: "No favourite shop found" });
        }
      } else {
        res.status(400).json({ message: "Favourite shop not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get list of favorite shops by user ID
const getFavoriteShopList = async (req, res) => {
  try {
    const user_id = req?.params?.id;
    const favourite_shop_list = await FavouriteShop.find({ user_id });
    if (favourite_shop_list) {
      res.status(200).json({ favourite_shop_list });
    } else {
      res.status(404).json({ message: "No favourite shop found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createFavouriteShop,
  getFavoriteShopList,
};
