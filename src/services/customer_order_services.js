const mongoose = require("mongoose");
const Order = require("../db/order.js");
const Wishlist = require("../db/wishlist.js");
const WishlistItem = require("../db/wishlist_item.js");
const Address = require("../db/address.js");
const Cart = require("../db/cart.js");
const Product = require("../db/product.js");
const ProductItem = require("../db/product_item.js");
const User = require("../db/user.js");
const SupportTicket = require("../db/support_ticket.js");
const { updateProductItem } = require("./order_item_services.js");
const { userType } = require("../utils/enums.js");
const { ObjectId } = mongoose.Types;

// * Function to create order
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const orderObj = {};
    for (let item in req?.body) {
      if (item === "shipping_address" || item === "billing_address") {
        const address = await Address.findOne(req.body[item])
          .session(session)
          .lean();
        if (!address) {
          const addressCollection = await new Address(req.body[item]);
          const newAddress = await addressCollection.save({ session });
          orderObj[item] = newAddress._id;
        } else {
          orderObj[item] = address._id;
        }
      } else {
        orderObj[item] = req.body[item];
      }
    }
    orderObj.ordered = true;
    const orderCollection = await new Order(orderObj);
    if (orderCollection._id) {
      if (req?.body?.items) {
        for (let product of req.body.items) {
          const productObj = await Product.findById(product.product_id)
            .session(session)
            .lean();
          if (productObj.quantity < product.quantity) {
            await session.abortTransaction();
            session.endSession();
            return res
              .status(400)
              .json({
                message: `Not that many ${product.name.en} is in the stock`,
              });
          }
          const updatedItem = await updateProductItem(
            product._id,
            { ...product, order_id: orderCollection._id },
            session
          );
          const updateProduct = await Product.findByIdAndUpdate(
            product.product_id,
            { $inc: { weight_matrics: 2, quantity: -product.quantity, order_matrics: product.quantity } },
            { new: true, session }
          );
          const updateUser = await User.findByIdAndUpdate(
            req?.body?.user_id,
            { $inc: { orders: 1 } },
            { new: true, session }
          );
        }
      }
      const order = await orderCollection.save({ session });
      await session.commitTransaction();
      session.endSession();
      if (order) {
        res.status(200).json({ order });
      } else {
        res.status(400).json({ message: "Order not created" });
      }
    } else {
      await session.commitTransaction();
      session.endSession();
      res.status(400).json({ message: "Error saving order" });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get orders using querystring
const getOrders = async (req, res) => {
  try {
    const query = {};
    let page = 1;
    let limit = 100;
    let sortBy = "createdAt";
    for (let item in req?.query) {
      if (item === "page" || item === "limit") {
        const number = Number(req.query[item]);
        if (!isNaN(number)) {
          if (item === "page") {
            page = number;
          } else {
            limit = number;
          }
        }
      } else if (item === "sortBy") {
        sortBy = req?.query[item];
      } else if (
        item === "user_id" ||
        item === "shop" ||
        item === "shipping_address" ||
        item === "billing_address"
      ) {
        query[item] = new ObjectId(req?.query[item]);
      } else {
        query[item] = req.query[item];
      }
    }
    query.is_custom_order = false;
    const allOrders = await Order.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await Order.countDocuments(query);
    if (allOrders.length > 0) {
      res.status(200).json({ orders: allOrders, total: count });
    } else {
      res.status(200).json({ orders: [], total: 0 });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get an order by ID
const getOrdersByID = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update an order by ID
const updateOrderByID = async (req, res) => {
  try {
    const order = await Order.findById(req?.params?.id).lean();
    if (order) {
      for (let item in req?.body) {
        if (item === "shipping_address" || item === "billing_address") {
          const address = await Address.findOne(req.body[item]).lean();
          if (!address) {
            const addressCollection = await new Address(req.body[item]);
            const newAddress = await addressCollection.save();
            order[item] = newAddress._id;
          } else {
            order[item] = address._id;
          }
        } else {
          order[item] = req.body[item];
        }
      }
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, order, {
        new: true,
      });
      if (updatedOrder) {
        res.status(200).json({ order: updatedOrder });
      } else {
        res.status(404).json({ message: "Order could not be updated" });
      }
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete an order by ID
const deleteOrderByID = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      res.status(400).json({ message: "Order not found" });
    } else {
      if (deletedOrder.billing_address) {
        await Address.findByIdAndDelete(deletedOrder.billing_address);
      }
      if (deletedOrder.shipping_address) {
        await Address.findByIdAndDelete(deletedOrder.shipping_address);
      }
      res.status(200).json({ message: "Order removed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get count of order, wishlist
const getInfos = async (req, res) => {
  try {
    const id = req?.query?.userId;
    if (req?.user?.type === userType.CUSTOMER) {
      const infoObj = {
        order_count: 0,
        wishlist_count: 0,
        cart_count: 0,
        ticket_count: 0,
      };
      infoObj.order_count = await Order.countDocuments({ user_id: id });
      const wishlist = await Wishlist.findOne({ userId: id });
      infoObj.wishlist_count = await WishlistItem.countDocuments({
        wishlist_id: wishlist._id,
      });
      const cart = await Cart.findOne({ user_id: id });
      infoObj.cart_count = await ProductItem.countDocuments({
        cart_id: cart._id,
      });
      infoObj.ticket_count = await SupportTicket.countDocuments({
        user_id: id,
      });
      res.status(200).json({ info: infoObj });
    } else if (req?.user?.type === userType.VENDOR) {
      const infoObj = {
        order_count: 0,
        product_count: 0,
        ticket_count: 0,
      };
      const shop = req?.query?.shopId;
      if (shop) {
        infoObj.order_count = await ProductItem.countDocuments({
          shop_id: shop,
          canceled: false,
          ordered: true,
        });
        infoObj.product_count = await Product.countDocuments({ shop });
        infoObj.ticket_count = await SupportTicket.countDocuments({
          user_id: id,
        });
        res.status(200).json({ info: infoObj });
      } else {
        res.status(400).json({ message: "shop is required" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByID,
  updateOrderByID,
  deleteOrderByID,
  getInfos,
};
