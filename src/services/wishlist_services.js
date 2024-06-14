const Wishlist = require("../db/wishlist");
const WishlistItem = require("../db/wishlist_item");
const Product = require("../db/product");
const mongoose = require("mongoose");
const { userType } = require("../utils/enums");

const { ObjectId } = mongoose.Types;

// * Function to create a wishlist for a user
const createWishlist = async (body, session = false) => {
  try {
    const wishlistObj = {
      userId: body?.userId,
    };
    const wishlistCollection = await new Wishlist(wishlistObj);
    let wishlist = null;
    if (session) {
      wishlist = await wishlistCollection.save({ session });
    } else {
      wishlist = await wishlistCollection.save();
    }
    return wishlist.toObject();
  } catch (err) {
    throw err;
  }
};

// * Function to get a wish list by id
const getWishlistByID = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (
      req.user.type !== userType.CUSTOMER ||
      req.user.id.toString() !== req.params.id
    ) {
      await session.commitTransaction();
      session.endSession();
      res.status(400).json({ message: "Unauthorised token" });
    } else {
      const wishlist = await Wishlist.findOne({ userId: req.params.id })
        .session(session)
        .lean();
      if (!wishlist) {
        const newWishlist = await createWishlist({
          userId: req?.params?.id,
          session,
        });
        await session.commitTransaction();
        session.endSession();
        if (newWishlist) {
          res.status(200).json({ wishlist: newWishlist });
        } else {
          res.status(400).json({ message: "Wishlist loading failed" });
        }
      } else {
        wishlist.products = await WishlistItem.find({
          wishlist_id: wishlist._id,
        }).session(session);
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ wishlist });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Helper function to add product in wishlist
const addProductInWishlist = async (wishlist, product, session) => {
  try {
    const wishlistItemCollection = await new WishlistItem({
      wishlist_id: wishlist._id,
      product: product,
    });
    const wishlistItem = await wishlistItemCollection.save({ session });
    const updatedWishlist = await Wishlist.findById(wishlist._id).session(
      session
    );
    updatedWishlist.products = await WishlistItem.find({
      wishlist_id: updatedWishlist._id,
    }).session(session);
    return updatedWishlist;
  } catch (err) {
    throw err;
  }
};

// * Helper function to delete a product from wishlist
const deleteProductFromWishlist = async (wishlist, searchId, session) => {
  try {
    await WishlistItem.findByIdAndDelete(searchId).session(session);
    const updatedWishlist = await Wishlist.findById(wishlist._id).session(
      session
    );
    updatedWishlist.products = await WishlistItem.find({
      wishlist_id: updatedWishlist._id,
    }).session(session);
    return updatedWishlist;
  } catch (err) {
    throw err;
  }
};

// * Helper function to check a product in wishlist
const getProductInWishlist = async (user_id, product) => {
  try {
    const wishlist = await Wishlist.findOne({ user_id }).lean();
    const wishlistItem = await WishlistItem.findOne({
      wishlist_id: wishlist._id,
      product,
    });
    return wishlistItem;
  } catch (err) {
    throw err;
  }
};

// * Function to add a product in a wish list by id
const addWishlistProductByID = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (
      req.user.type !== userType.CUSTOMER ||
      req.user.id.toString() !== req.params.id
    ) {
      await session.commitTransaction();
      session.endSession();
      res.status(400).json({ message: "Unauthorised token" });
    } else {
      const wishlist = await Wishlist.findOne({ userId: req.params.id }).lean();
      if (!wishlist) {
        const newWishlist = await createWishlist({
          userId: req?.params?.id,
        });
        if (newWishlist) {
          const updatedWishlist = await addProductInWishlist(
            newWishlist,
            req?.body?.product,
            session
          );
          await session.commitTransaction();
          session.endSession();
          res.status(200).json({
            message: "New product added in wishlist",
            wishlist: updatedWishlist,
          });
        } else {
          await session.commitTransaction();
          session.endSession();
          res
            .status(404)
            .json({ message: "Couldn't added into wishlist, try again" });
        }
      } else {
        const productItem = await WishlistItem.findOne({
          wishlist_id: wishlist._id,
          product: req?.body?.product,
        }).session(session);
        let updatedWishlist = null;
        if (!productItem) {
          updatedWishlist = await addProductInWishlist(
            wishlist,
            req.body.product,
            session
          );
        } else {
          updatedWishlist = await deleteProductFromWishlist(
            wishlist,
            productItem._id,
            session
          );
        }
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
          wishlist: updatedWishlist,
        });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete a product from wish list by id
const deleteWishlistProductByID = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (
      req.user.type !== userType.CUSTOMER ||
      req.user.id.toString() !== req.params.id
    ) {
      await session.commitTransaction();
      session.endSession();
      res.status(400).json({ message: "Unauthorised token" });
    } else {
      const wishlist = await Wishlist.findOne({ userId: req.params.id })
        .session(session)
        .lean();
      if (!wishlist) {
        await session.commitTransaction();
        session.endSession();
        res.status(404).json({ message: "No wishlist Found" });
      } else {
        const searchId = new ObjectId(req.body.product);
        const updatedWishlist = await deleteProductFromWishlist(
          wishlist,
          searchId,
          session
        );
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
          message: "Product deleted in wishlist",
          wishlist: updatedWishlist,
        });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get if a product is in the wishlist
const getProductInWistlist = async (req, res) => {
  try {
    const user_id = req?.params?.id;
    const wishlistItem = await getProductInWishlist(
      user_id,
      req?.body?.product_id
    );
    if (wishlistItem) {
      res.status(200).json({ wishlistItem });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to clear wishlist by user id
const clearWishlist = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user_id = req?.params?.id;
    const wishlist = await Wishlist.findOne({ userId: user_id }).session(session).lean();
    const items = await WishlistItem.find({ wishlist_id: wishlist._id }).session(session).lean();
    const state = [];
    for (let item of items) {
      const deletedItem = await WishlistItem.findByIdAndDelete(item._id).session(session);
      if (deletedItem) {
        state.push(deletedItem);
      }
    }
    await session.commitTransaction();
    session.endSession();
    if (state.length === items.length) {
      res.status(200).json({ message: "All items deleted successfully" });
    } else if (state.length > 0) {
      res.status(200).json({ message: "Some items deleted successfully" });
    } else {
      res.status(400).json({ message: "Items could not be deleted" });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getWishlistByID,
  addWishlistProductByID,
  deleteWishlistProductByID,
  getProductInWistlist,
  clearWishlist,
};
