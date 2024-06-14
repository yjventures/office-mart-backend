const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Dispute = require("../db/dispute");
const ProductItem = require("../db/product_item");
const { createTicket } = require("./support_ticket_services");

// * Function to create a dispute
const createDispute = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      session.startTransaction();
      const disputeObj = {};
      for (let item in req?.body) {
        disputeObj[item] = req?.body[item];
      }
      const disputeCollection = await new Dispute(disputeObj);
      const dispute = await disputeCollection.save({ session });
      const disputeProduct = await ProductItem.findByIdAndUpdate(
        req?.body?.product_item,
        { status: "in-dispute" },
        { new: true, session }
      );
      const supportTicketObj = {
        user_id: req?.body?.customer_id,
        dispute_id: dispute._id,
        images: req?.body?.images,
        tags: ['urgent'],
        caption: `Dispute - ${req?.body?.reason}`,
        detail: req?.body?.detail,
      };
      const supportTicket = await createTicket(supportTicketObj, session);
      await session.commitTransaction();
      session.endSession();
      if (dispute) {
        res.status(200).json({ dispute });
      } else {
        res.staus(400).json({ message: "Dispute not created" });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to create batch dispute
const createBatchDispute = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      session.startTransaction();
      for (let product_item of req?.body?.product_items) {
        const disputeObj = {};
        for (let item in req?.body) {
          if (item !== "product_items") {
            disputeObj[item] = req?.body[item];
          }
        }
        disputeObj.product_item = product_item?._id;
        disputeObj.shop = product_item?.shop_id;
        const disputeCollection = await new Dispute(disputeObj);
        const dispute = await disputeCollection.save();
        if (!dispute) {
          throw new Error("Dispute cannot be created");
        }
      }
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ message: "Dispute created" });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all disputes using querystring
const getAllDisputes = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const query = {};
      let limit = 10,
        page = 1;
      let sortBy = "createdAt";
      for (let item in req?.query) {
        if (item === "page" || item === "limit") {
          let num = Number(req.query[item]);
          if (!isNaN(num)) {
            if (item === "page") {
              page = num;
            } else {
              limit = num;
            }
          }
        } else if (item === "sortBy") {
          sortBy = req.query[item];
        } else {
          query[item] = req.query[item];
        }
      }
      const disputes = await Dispute.find(query)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit);
      if (disputes) {
        res.status(200).json({ disputes });
      } else {
        res.status(404).json({ message: "Dispute not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a dispute by ID
const getDisputeByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params?.id;
      const dispute = await Dispute.findById(id);
      if (dispute) {
        res.status(200).json({ dispute });
      } else {
        res.status(404).json({ message: "Dispute not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update dispute by ID
const updateDisputeByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params?.id;
      const dispute = await Dispute.findById(id).lean();
      if (!dispute) {
        res.status(404).json({ message: "Dispute not found" });
      } else {
        for (let item in req?.body) {
          dispute[item] = req?.body[item];
        }
        const updatedDispute = await Dispute.findByIdAndUpdate(id, dispute, {
          new: true,
        });
        if (updatedDispute) {
          res.status(200).json({ dispute: updatedDispute });
        } else {
          res.status(400).json({ message: "Dispute not updated" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to dispute a product
const disputeProductByID = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      session.startTransaction();
      const id = req?.params?.id;
      const dispute = await Dispute.findById(id).lean();
      if (!dispute) {
        await session.commitTransaction();
        session.endSession();
        res.status(404).json({ message: "Dispute not found" });
      } else {
        for (let item in req?.body) {
          dispute[item] = req?.body[item];
        }
        const updatedDispute = await Dispute.findByIdAndUpdate(id, dispute, {
          new: true,
        });
        const disputeProduct = await ProductItem.findByIdAndUpdate(
          dispute.product_item,
          { status: "disputed", disputed: true },
          { new: true, session }
        );
        await session.commitTransaction();
        session.endSession();
        if (updatedDispute) {
          res.status(200).json({ dispute: updatedDispute });
        } else {
          res.status(400).json({ message: "Dispute not updated" });
        }
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete dispute by ID
const deleteDisputeByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params?.id;
      const dispute = await Dispute.findById(id).lean();
      if (!dispute) {
        res.status(404).json({ message: "Dispute not found" });
      } else {
        const deletedDispute = await Dispute.findByIdAndDelete(id);
        if (deletedDispute) {
          res.status(200).json({ message: "Dispute delete successfull" });
        } else {
          res.status(400).json({ message: "Dispute not updated" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createDispute,
  createBatchDispute,
  getAllDisputes,
  getDisputeByID,
  updateDisputeByID,
  deleteDisputeByID,
  disputeProductByID,
};
