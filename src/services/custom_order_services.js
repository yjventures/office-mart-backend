const CustomOrder = require('../db/custom_order');
const Cart = require('../db/cart');
const { createProductItem } = require('./order_item_services');

// * Function to create a custom order
const createCustomOrder = async (req, res) => {
  try {
    const customOrderObj = {};
    for (let item in req?.body) {
      if (item !== 'order') {
        customOrderObj[item] = req.body[item];
      }
    }
    if (req?.body?.order?.items) {
      const cartObj = {};
      cartObj.user_id = req.body.customer_id;
      const items = [];
      for (let item of req?.body?.order?.items) {
        const productItem = await createProductItem(item);
        items.push(productItem._id);
      }
      cartObj.items = items;
      const cartCollection = await new Cart(cartObj);
      const cart = await cartCollection.save();
      if (cart) {
        customOrderObj.cart_id = cart._id;
        const customOrderCollection = await new CustomOrder(customOrderObj);
        const customOrder = await customOrderCollection.save();
        if (customOrder) {
          res.status(200).json({ custom_order: customOrder });
        } else {
          res.status(404).json({ message: 'Cannot create custom order' });
        }
      } else {
        res.status(404).json({ message: 'Cannot create custom order' });
      } 
    } else {
      res.status(404).json({ message: 'Products not found' });
    }
    
      
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// * Function to get all custom orders using querystring
const getAllCustomOrder = async (req, res) => {
  try {
    const query = {};
    let page = 1, limit = 10;
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
      } else {
        query[item] = req.query[item];
      }
    }
    const allCustomOrderInfo = await CustomOrder.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await CustomOrder.countDocuments(query);
    if (allCustomOrderInfo.length > 0) {
      res.status(200).json({ custom_orders: allCustomOrderInfo, total: count });
    } else {
      res.status(200).json({ custom_orders: [] });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// * Function to get custom order by ID
const getCustomOrderByID = async (req, res) => {
  try {
    const customOrderId = req?.params?.id;
    const customOrder = await CustomOrder.findById(customOrderId);
    if (customOrder) {
      res.status(200).json({ custom_order: customOrder });
    } else {
      res.status(404).json({ message: 'Custom order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// * Function to update a custom order by ID
const updateCustomOrderByID = async (req, res) => {
  try {
    const customOrderId = req?.params?.id;
    const customOrder = await CustomOrder.findById(customOrderId).lean();
    if (!customOrder) {
      res.status(404).json({ message: 'Custom order not found' });
    } else {
      let cart = null;
      if (req?.body?.order) {
        cart = await Cart.findById(customOrder.cart_id).lean();
      }
      for (let item in req?.body) {
        customOrder[item] = req.body[item];
      }
      if (cart) {
        await Cart.findByIdAndUpdate(customOrder.cart_id, cart, { new: true });
      }
      const updatedCustomOrder = await CustomOrder.findByIdAndUpdate(customOrder._id, customOrder, { new: true });
      if (updatedCustomOrder) {
        res.status(200).json({ custom_order: updatedCustomOrder });
      } else {
        res.status(400).json({ message: 'Custom order could not be updated' });
      }
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// * Function to delete a custom order by id
const deleteCustomOrderByID = async (req, res) => {
  try {
    const customOrderId = req?.params?.id;
    const customOrder = await CustomOrder.findByIdAndDelete(customOrderId);
    if (customOrder) {
      res.status(200).json({ message: 'Custom order is deleted' });
    } else {
      res.status(404).json({ message: 'Custom order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  createCustomOrder,
  getAllCustomOrder,
  getCustomOrderByID,
  updateCustomOrderByID,
  deleteCustomOrderByID,
};
