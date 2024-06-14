const mongoose = require("mongoose");
const Cart = require("../db/cart");
const Product = require("../db/product");
const ProductItem = require("../db/product_item");
const {
  createProductItem,
  deleteProductItem,
  updateProductItem,
} = require("./order_item_services");
const { ObjectId } = mongoose.Types;

// * Function to create a cart
const createCart = async (body, session = false) => {
  try {
    const cartItemObj = {};
    if (body?.user_id) {
      cartItemObj.user_id = body.user_id;
    } else if (body?.unique_token) {
      cartItemObj.unique_token = body.unique_token;
    }
    if (body?.items) {
      cartItemObj.items = body.items;
    }
    const cartCollection = await new Cart(cartItemObj);
    let cart = null;
    if (session) {
      cart = await cartCollection.save({ session });
    } else {
      cart = await cartCollection.save();
    }
    return cart ? cart.toObject() : null;
  } catch (err) {
    throw err;
  }
};

// * Function to get card using user ID
const getCartByUserID = async (req, res) => {
  try {
    const user_id = req?.params?.id;
    const cart = await Cart.findOne({ user_id });
    if (cart) {
      cart.items = await ProductItem.find({ cart_id: cart._id });
      res.status(200).json({ cart });
    } else {
      const newCart = await createCart({ user_id });
      if (newCart) {
        newCart.items = await ProductItem.find({ cart_id: newCart._id });
        res.status(200).json({ cart: newCart });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get card using unique token
const getCartByToken = async (req, res) => {
  try {
    const unique_token = req?.params?.id;
    const cart = await Cart.findOne({ unique_token });
    if (cart) {
      cart.items = await ProductItem.find({ cart_id: cart._id });
      res.status(200).json({ cart });
    } else {
      const newCart = await createCart({ unique_token });
      if (newCart) {
        newCart.items = await ProductItem.find({ cart_id: newCart._id });
        res.status(200).json({ cart: newCart });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to add product in cart
const addProductInCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user_id = req?.params?.id;
    const cart = await Cart.findOne({ user_id }).session(session).lean();
    if (!cart) {
      const newCart = await createCart({ user_id }, session);
      if (newCart) {
        const productItem = await createProductItem(
          { ...req?.body?.product_item, cart_id: newCart._id },
          session
        );
        const updateProduct = await Product.findByIdAndUpdate(
          req?.body?.product_item.product_id,
          { $inc: { weight_matrics: 1 } },
          { new: true, session }
        );
        if (req?.body?.total_price) {
          newCart.total_price = req.body.total_price;
        }
        await session.commitTransaction();
        session.endSession();
        if (newCart) {
          res
            .status(200)
            .json({ message: "Product added successfully", cart: newCart });
        } else {
          res.status(404).json({ message: "Error adding product in cart" });
        }
      } else {
        await session.commitTransaction();
        session.endSession();
        res.status(404).json({ message: "Error adding product in cart" });
      }
    } else {
      let oldProductItem = null;
      if (req?.body?.add_to_cart) {
        const searchElement = {
          name: {
            en: req?.body?.product_item?.name,
          },
          product_id: req?.body?.product_item?.product_id,
          shop_id: req?.body?.product_item?.shop_id,
          product_varient: req?.body?.product_item?.product_varient,
          cart_id: cart._id,
          ordered: false,
        };
        oldProductItem = await ProductItem.findOne(searchElement)
          .session(session)
          .lean();
      }
      if (oldProductItem) {
        await ProductItem.findByIdAndUpdate(
          oldProductItem._id,
          {
            $inc: {
              quantity: req?.body?.product_item?.quantity,
              total_price: req?.body?.product_item?.total_price,
            },
          },
          { new: true, session }
        );
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ cart });
      } else {
        const productItem = await createProductItem(
          { ...req?.body?.product_item, cart_id: cart._id },
          session
        );
        const updateProduct = await Product.findByIdAndUpdate(
          req?.body?.product_item.product_id,
          { $inc: { weight_matrics: 1 } },
          { new: true, session }
        );
        cart.total_price = req.body.total_price;
        const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
          new: true,
          session,
        });
        await session.commitTransaction();
        session.endSession();
        if (updatedCart) {
          res
            .status(200)
            .json({ message: "Product added successfully", cart: updatedCart });
        } else {
          res.status(404).json({ message: "Error adding product in cart" });
        }
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to add product in cart for ghost account
const addProductInCartByToken = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const unique_token = req?.params?.id;
    const cart = await Cart.findOne({ unique_token }).session(session).lean();
    if (!cart) {
      const newCart = await createCart({ unique_token }, session);
      if (newCart) {
        const productItem = await createProductItem(
          { ...req?.body?.product_item, cart_id: newCart._id },
          session
        );
        const updateProduct = await Product.findByIdAndUpdate(
          req?.body?.product_item.product_id,
          { $inc: { weight_matrics: 1 } },
          { new: true, session }
        );
        if (req?.body?.total_price) {
          newCart.total_price = req.body.total_price;
        }
        await session.commitTransaction();
        session.endSession();
        if (newCart) {
          res
            .status(200)
            .json({ message: "Product added successfully", cart: newCart });
        } else {
          res.status(404).json({ message: "Error adding product in cart" });
        }
      } else {
        await session.commitTransaction();
        session.endSession();
        res.status(404).json({ message: "Error adding product in cart" });
      }
    } else {
      let oldProductItem = null;
      if (req?.body?.add_to_cart) {
        const searchElement = {
          name: {
            en: req?.body?.product_item?.name,
          },
          product_id: req?.body?.product_item?.product_id,
          shop_id: req?.body?.product_item?.shop_id,
          product_varient: req?.body?.product_item?.product_varient,
          cart_id: cart._id,
          ordered: false,
        };
        oldProductItem = await ProductItem.findOne(searchElement)
          .session(session)
          .lean();
      }
      if (oldProductItem) {
        await ProductItem.findByIdAndUpdate(
          oldProductItem._id,
          {
            $inc: {
              quantity: req?.body?.product_item?.quantity,
              total_price: req?.body?.product_item?.total_price,
            },
          },
          { new: true, session }
        );
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ cart });
      } else {
        const productItem = await createProductItem(
          { ...req?.body?.product_item, cart_id: cart._id },
          session
        );
        const updateProduct = await Product.findByIdAndUpdate(
          req?.body?.product_item.product_id,
          { $inc: { weight_matrics: 1 } },
          { new: true, session }
        );
        cart.total_price = req.body.total_price;
        const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
          new: true,
          session,
        });
        if (updatedCart) {
          await session.commitTransaction();
          session.endSession();
          res
            .status(200)
            .json({ message: "Product added successfully", cart: updatedCart });
        } else {
          await session.abortTransaction();
          session.endSession();
          res.status(404).json({ message: "Error adding product in cart" });
        }
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete a product from the cart
const deleteProductInCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user_id = req.params.id;
    const cart = await Cart.findOne({ user_id }).session(session).lean();
    if (!cart) {
      await session.commitTransaction();
      session.endSession();
      res.status(404).json({ message: "Cart not found" });
    } else {
      if (req?.body?.permanent) {
        const searchId = new ObjectId(req.body.item_id);
        const status = await deleteProductItem(searchId, session);
        await session.commitTransaction();
        session.endSession();
        if (!status) {
          return res
            .status(404)
            .json({ message: "Error deleting product from cart" });
        } else {
          res
            .status(200)
            .json({ message: "Product deleted successfully", cart });
        }
      } else {
        const updateItem = await updateProductItem(req.body.item_id, { cart_id: null },  session);
        await session.commitTransaction();
        session.endSession();
        if (updateItem) {
          res
            .status(200)
            .json({ message: "Product deleted successfully", cart });
        } else {
          res.status(404).json({ message: "Error deleting product from cart" });
        }
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete a product from the cart for guest
const deleteProductInCartByToken = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const unique_token = req.params.id;
    const cart = await Cart.findOne({ unique_token }).session(session).lean();
    if (!cart) {
      await session.commitTransaction();
      session.endSession();
      res.status(404).json({ message: "Cart not found" });
    } else {
      if (req?.body?.permanent) {
        const searchId = new ObjectId(req.body.item_id);
        const status = await deleteProductItem(searchId, session);
        await session.commitTransaction();
        session.endSession();
        if (!status) {
          return res
            .status(404)
            .json({ message: "Error deleting product from cart" });
        } else {
          res
            .status(200)
            .json({ message: "Product deleted successfully", cart });
        }
      } else {
        const updateItem = await updateProductItem(req.body.item_id, { cart_id: null },  session);
        await session.commitTransaction();
        session.endSession();
        if (updateItem) {
          res
            .status(200)
            .json({ message: "Product deleted successfully", cart });
        } else {
          res.status(404).json({ message: "Error deleting product from cart" });
        }
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a product in the cart
const updateProductInCart = async (req, res) => {
  try {
    const user_id = req?.params?.id;
    const product = req?.body?.product_item;
    if (product) {
      const id = product?._id;
      const updatedProduct = await updateProductItem(id, product);
      if (updatedProduct) {
        const cart = await Cart.findOne({ user_id });
        res.status(200).json({ cart });
      } else {
        res.status(400).json({ message: "Product can't be updated" });
      }
    } else {
      res.status(500).json({ message: "No product is given" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a product in the cart by token
const updateProductInCartByToken = async (req, res) => {
  try {
    const unique_token = req?.params?.id;
    const product = req?.body?.product_item;
    if (product) {
      const id = product?._id;
      const updatedProduct = await updateProductItem(id, product);
      if (updatedProduct) {
        const cart = await Cart.findOne({ unique_token });
        res.status(200).json({ cart });
      } else {
        res.status(400).json({ message: "Product can't be updated" });
      }
    } else {
      res.status(500).json({ message: "No product is given" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to clear cart
const clearCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user_id = req.params.id;
    const cart = await Cart.findOne({ user_id }).session(session).lean();
    if (!cart) {
      await session.commitTransaction();
      session.endSession();
      res.status(404).json({ message: "Cart not found" });
    } else {
      const state = [];
      cart.items = await ProductItem.find({ cart_id: cart._id }).session(session).lean();
      for (let item of cart?.items) {
        const status = await deleteProductItem(item._id, session);
        if (status) {
          state.push(status);
        }
      }
      await session.commitTransaction();
      session.endSession();
      if (state.length === cart.items.length) {
        res.status(200).json({ message: "All cart items successfully deleted" });
      } else if (state.length > 0) {
        res.status(200).json({ message: "Some cart items successfully deleted" });
      } else {
        res.status(404).json({ message: "Deletion in cart failed" });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to clear cart for ghost accounts
const clearCartGhost = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const unique_token = req.params.id;
    const cart = await Cart.findOne({ unique_token }).session(session).lean();
    if (!cart) {
      await session.commitTransaction();
      session.endSession();
      res.status(404).json({ message: "Cart not found" });
    } else {
      const state = [];
      cart.items = await ProductItem.find({ cart_id: cart._id }).session(session).lean();
      for (let item of cart?.items) {
        const status = await deleteProductItem(item._id, session);
        if (status) {
          state.push(status);
        }
      }
      await session.commitTransaction();
      session.endSession();
      if (state.length === cart.items.length) {
        res.status(200).json({ message: "All cart items successfully deleted" });
      } else if (state.length > 0) {
        res.status(200).json({ message: "Some cart items successfully deleted" });
      } else {
        res.status(404).json({ message: "Deletion in cart failed" });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getCartByUserID,
  addProductInCart,
  deleteProductInCart,
  updateProductInCart,
  clearCart,
  getCartByToken,
  clearCartGhost,
  addProductInCartByToken,
  deleteProductInCartByToken,
  updateProductInCartByToken
};
