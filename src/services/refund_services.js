const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Refund = require("../db/refund");
const ProductItem = require("../db/product_item");
const { userType } = require("../utils/enums");

// * Function to create a refund
const createRefund = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      session.startTransaction();
      const refundObj = {};
      for (let item in req?.body) {
        if (item === "reason") {
          const intlObj = {};
          if (req.body[item].ac) {
            intlObj.ac = req.body[item].ac;
          }
          if (req.body[item].en) {
            intlObj.en = req.body[item].en;
          }
          refundObj[item] = intlObj;
        }
        else {
          refundObj[item] = req.body[item];
        }
      }
      const refundCollection = await new Refund(refundObj);
      const refund = await refundCollection.save({ session });
      const updateProductItem = await ProductItem.findByIdAndUpdate(
        req?.body?.product_item,
        { canceled: true },
        { new: true, session }
      );
      await session.commitTransaction();
      session.endSession();
      if (refund) {
        res.status(200).json({ refund });
      } else {
        res.status(404).json({ message: "Refund cannot be created" });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to create batch refund
const createBatchRefund = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      session.startTransaction();
      for (let product_item of req?.body?.product_items) {
        const refundObj = {};
        for (let item in req?.body) {
          if (item !== "product_items") {
            refundObj[item] = req.body[item];
          }
        }
        refundObj.product_item = product_item._id;
        refundObj.shop = product_item.shop_id;
        const refundCollection = await new Refund(refundObj);
        const refund = await refundCollection.save({ session });
        const updateProductItem = await ProductItem.findByIdAndUpdate(
          product_item._id,
          { canceled: true },
          { new: true, session }
        );
        if (!refund || !updateProductItem) {
          throw new Error("Refund cannot be created");
        }
      }
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ message: "Refund created" });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get refunds using querystring
const getAllRefund = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type === userType.VENDOR ||
      req?.user?.type === userType.ADMIN ||
      req?.user?.type === userType.SUPER_ADMIN
    ) {
      const query = {};
      let limit = 10,
        page = 1;
      let sortBy = 'createdAt';
      for (let item in req?.query) {
        if (item === "page" || item === "limit") {
          const num = Number(req?.query[item]);
          if (!isNaN(num)) {
            if (item === "page") {
              page = num;
            } else {
              limit = num;
            }
          }
        } else if (item === "sortBy") {
          sortBy = req?.query[item];
        } else {
          query[item] = req.query[item];
        }
      }
      const refunds = await Refund.find(query)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await Refund.countDocuments(query);
      if (refunds) {
        res.status(200).json({ refunds, total });
      } else {
        res.status(404).json({ message: "Refund not found" });
      }
    } else {
      res.status(404).json({ message: "You have to be admin or vendor" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a refund by ID
const getRefundByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params.id;
      const refund = await Refund.findById(id);
      if (refund) {
        res.status(200).json({ refund });
      } else {
        res.status(400).json({ message: "Refund not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a refund by ID
const updateRefundByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type === userType.ADMIN ||
      req?.user?.type === userType.VENDOR ||
      req?.user?.type === userType.SUPER_ADMIN
    ) {
      const id = req?.params?.id;
      const refund = await Refund.findById(id).lean();
      if (refund) {
        for (let item in req?.body) {
          refund[item] = req.body[item];
        }
        const updatedRefund = await Refund.findByIdAndUpdate(id, refund, {
          new: true,
        });
        if (updatedRefund) {
          res.status(200).json({ refund: updatedRefund });
        }
      } else {
        res.status(404).json({ message: "Refund not found" });
      }
    } else {
      res.status(404).json({ message: "You have to be admin or vendor" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete a refund by ID
const deleteRefundByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type === userType.ADMIN ||
      req?.user?.type === userType.SUPER_ADMIN
    ) {
      const id = req?.params?.id;
      const refund = await Refund.findByIdAndDelete(id);
      if (refund) {
        res.status(200).json({ message: "Refund successfully deleted." });
      } else {
        res.status(404).json({ message: "Refund not found." });
      }
    } else {
      res.status(404).json({ message: "You have to be admin" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};



module.exports = {
  createRefund,
  getAllRefund,
  getRefundByID,
  updateRefundByID,
  deleteRefundByID,
  createBatchRefund,
};
