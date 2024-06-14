const ShippingAndVat = require("../db/shipping_and_vat");
const { userType } = require("../utils/enums");

// * Function to create shipping and vat data
const createShippingAndVatData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const shippingAndVatObject = {};
      for (let item in req?.body) {
        shippingAndVatObject[item] = req.body[item];
      }
      const shippingAndVatCollection = await new ShippingAndVat(
        shippingAndVatObject
      );
      const shippingAndVat = await shippingAndVatCollection.save();
      if (shippingAndVat) {
        res.status(200).json({ shipping_and_vat: shippingAndVat });
      } else {
        res.status(404).json({ message: "shipping and vat not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get shipping and vat data using querystring
const getShippingAndVatData = async (req, res) => {
  try {
    const query = {};
    let limit = 10,
      page = 1;
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
      } else {
        query[item] = req.query[item];
      }
    }
    const allShippingAndVat = await ShippingAndVat.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await ShippingAndVat.countDocuments(query);
    if (allShippingAndVat) {
      res
        .status(200)
        .json({ shipping_and_vats: allShippingAndVat, total: count });
    } else {
      res.status(404).json({ message: "shipping and vat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get shipping and vat data using ID
const getShippingAndVatDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const shipping_and_vat = await ShippingAndVat.findById(id);
    if (shipping_and_vat) {
      res.status(200).json({ shipping_and_vat });
    } else {
      res.status(404).json({ message: "shipping and vat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update shipping and vat data using ID
const updateShippingAndVatDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const shipping_and_vat = await ShippingAndVat.findById(id).lean();
      for (let item in req?.body) {
        shipping_and_vat[item] = req.body[item];
      }
      const shippingAndVat = await ShippingAndVat.findByIdAndUpdate(
        id,
        shipping_and_vat,
        {
          new: true,
        }
      );
      if (shippingAndVat) {
        res.status(200).json({ shipping_and_vat: shippingAndVat });
      } else {
        res.status(404).json({ message: "shipping and vat not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete shipping and vat data using ID
const deleteShippingAndVatDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const shipping_and_vat = await ShippingAndVat.findById(id);
      if (shipping_and_vat) {
        await ShippingAndVat.findByIdAndDelete(id);
        res
          .status(200)
          .json({ message: "shipping and vat deleted successfully" });
      } else {
        res.status(404).json({ message: "shipping and vat not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createShippingAndVatData,
  getShippingAndVatData,
  getShippingAndVatDataByID,
  updateShippingAndVatDataByID,
  deleteShippingAndVatDataByID,
};
