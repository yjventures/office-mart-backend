const mongoose = require("mongoose");
const ProductItem = require("../db/product_item");
const { ObjectId } = mongoose.Types;

// * Helper Function to create a order item/product item
const createProductItem = async (body, session = false) => {
  try {
    const productItemObj = {};
    if ("product_id" in body) {
      productItemObj.product_id = body.product_id;
    }
    if ("product_varient" in body) {
      productItemObj.product_varient = body.product_varient;
    }
    if (Object.keys(productItemObj).length === 0) {
      res
        .status(400)
        .json({ message: "Product id or variation id is missing" });
    } else {
      if (body?.name) {
        productItemObj.name = body.name;
      }
      if (body?.price) {
        productItemObj.price = body.price;
      }
      if (body?.quantity) {
        productItemObj.quantity = body.quantity;
      }
      if (body?.total_price) {
        productItemObj.total_price = body.total_price;
      }
      if (body?.image) {
        productItemObj.image = body.image;
      }
      if (body?.shop_id) {
        productItemObj.shop_id = body.shop_id;
      }
      if (body?.user_id) {
        productItemObj.user_id = body.user_id;
      }
      if (body?.paid_amount) {
        productItemObj.paid_amount = body.paid_amount;
      }
      if (body?.cart_id) {
        productItemObj.cart_id = body.cart_id;
      }
      productItemObj.ordered = false;
      const productItemCollection = await new ProductItem(productItemObj);
      if (session) {
        product = await productItemCollection.save({ session });
      } else {
        product = await productItemCollection.save();
      }

      return product ? product.toObject() : null;
    }
  } catch (err) {
    throw err;
  }
};

// * Function to create a new product item
const createNewProductItem = async (req, res) => {
  try {
    const productItem = await createProductItem(req?.body);
    if (productItem) {
      res.status(200).json({ productItem });
    } else {
      res.status(400).json({ message: 'Product item not created' });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all order item/product item
const getProductItem = async (req, res) => {
  try {
    const query = {
      canceled: false,
      ordered: true,
      disputed: false,
    };
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
      } else if (item === "start_date" || item === "end_date") {
        query.order_date = {
          $gte: new Date(req?.query?.start_date),
          $lte: new Date(req?.query?.end_date),
        };
      } else if (item === "sortBy") {
        sortBy = req?.query[item];
      } else if (
        item === "user_id" ||
        item === "shop_id" ||
        item === "cart_id" ||
        item === "order_id" ||
        item === "product_varient" ||
        item === "review_id"
      ) {
        query[item] = new ObjectId(req?.query[item]);
      } else {
        query[item] = req.query[item];
      }
    }
    const product = await ProductItem.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await ProductItem.countDocuments(query);
    if (product) {
      res.status(200).json({ product, total });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a order item/product item by ID
const getProductByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const product_item = await ProductItem.findById(id);
    if (product_item) {
      res.status(200).json({ product_item });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete a order item/product item by ID
const deleteProductItem = async (id, session = false) => {
  try {
    if (id) {
      let productItem = null;
      if (session) {
        productItem = await ProductItem.findByIdAndDelete(id, {session});
      } else {
        productItem = await ProductItem.findByIdAndDelete(id);
      }
      if (productItem) {
        return productItem;
      } else {
        return null;
      }
    }
  } catch (err) {
    throw err;
  }
};

// * Helper function to update a order item/product item by ID
const updateProductItem = async (id, body, session = false) => {
  try {
    if (id) {
      let productItem = null;
      if (session) {
        productItem = await ProductItem.findById(id).session(session).lean();
      } else {
        productItem = await ProductItem.findById(id).lean();
      }
      for (let item in body) {
        productItem[item] = body[item];
      }
      let product = null;
      if (session) {
        product = await ProductItem.findByIdAndUpdate(id, productItem, {
          new: true,
          session,
        });
      } else {
        product = await ProductItem.findByIdAndUpdate(id, productItem, {
          new: true,
        });
      }
      return product.toObject();
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

// * Function to update a order item/product item by ID
const updateProductItemByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const body = req?.body;
    const productItem = await updateProductItem(id, body);
    if (productItem) {
      res.status(200).json({ product: productItem });
    } else {
      res.status(404).json({ message: "Product could not be updated" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to cancel all order item/product item by IDs
const cancelBatchProductItemById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    for (let id of req?.body?.items) {
      const status = await updateProductItem(id, { canceled: true }, session);
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "All products canceled" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createProductItem,
  createNewProductItem,
  getProductItem,
  getProductByID,
  deleteProductItem,
  updateProductItem,
  updateProductItemByID,
  cancelBatchProductItemById,
};
