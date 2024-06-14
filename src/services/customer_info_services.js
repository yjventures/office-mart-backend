const { validationResult } = require("express-validator");
const User = require("../db/user");
const CustomerInfo = require("../db/customer_info");
const Address = require("../db/address");

// * Function to create a customer info
const createCustomerInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const infoObj = {};
      if (req?.body?.shipping_address) {
        const shippingAddress = await new Address(req?.body?.shipping_address);
        const newshippingAddress = await shippingAddress.save();
        infoObj.shipping_address = newshippingAddress._id;
      }
      if (req?.body?.billing_address) {
        const billingAddress = await new Address(req?.body?.billing_address);
        const newHomeAddress = await billingAddress.save();
        infoObj.billing_address = newHomeAddress._id;
      }
      const customerInfo = await new CustomerInfo(infoObj);
      const newCustomerInfo = await customerInfo.save();
      if (!newCustomerInfo) {
        res.status(400).json({ message: "Customer Info could not be created" });
      } else {
        const userId = req?.body?.userId;
        const newUser = await User.findByIdAndUpdate(userId, { customer_info: newCustomerInfo._id }, { new: true });
        res.status(200).json({ customer_info: newCustomerInfo });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all customer info
const getAllCustomerInfo = async (req, res) => {
  try {
    const allCustomerInfo = await CustomerInfo.find({});
    res.status(200).json({ cuetomers_info: allCustomerInfo });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a customer info by ID
const getCustomerInfoByID = async (req, res) => {
  try {
    const customerInfoID = req?.params?.id;
    const customerInfo = await CustomerInfo.findById(customerInfoID);
    res.status(200).json({ customerInfo });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a customer info
const updateCustomerInfoByID = async (req, res) => {
  try {
    for (let address of req?.body?.addresses) {
      const addressId = address.id;
      const addressBody = address.body;
      await Address.findByIdAndUpdate(addressId, addressBody, { new: true });
    }
    const customerInfo = await CustomerInfo.findById(req?.params?.id);
    if (customerInfo) {
      res.status(200).json({ customerInfo });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteCustomer = async (id) => {
  try {
    const customerInfo = await CustomerInfo.findByIdAndDelete(id);
    customerInfo.saved_addresses.forEach(async (element) => {
      await Address.findByIdAndDelete(element);
    });
    await Address.findByIdAndDelete(customerInfo.shipping_address);
    await Address.findByIdAndDelete(customerInfo.billing_address);
  } catch (err) {
    throw new Error({ message: 'Delete failed'});
  }
};

// * Function to delete a customer info
const deleteCustomerInfoByID = async (req, res) => {
  try {
    await deleteCustomer(req?.params?.id);
    res.status(200).json({  message: "Customer info deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createCustomerInfo,
  getAllCustomerInfo,
  getCustomerInfoByID,
  updateCustomerInfoByID,
  deleteCustomerInfoByID,
  deleteCustomer,
};
