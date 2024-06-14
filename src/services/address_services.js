const { validationResult } = require("express-validator");
const Address = require("../db/address");


// * Function to create an address
const createAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const addressObj = {};
      for (let item in req?.body) {
        addressObj[item] = req?.body[item];
      }
      const addressCollection  = await new Address(addressObj);
      const address = await addressCollection.save();
      if (address) {
        res.status(200).json({ address });
      } else {
        res.status(400).json({ message: "Address not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all addresses using query string
const getAllAddresses = async (req, res) => {
  try {
    const query = {};
      let limit = 10;
      let page = 1;
      let sortBy = "createdAt";
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
      const addresses = await Address.find(query)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await Address.countDocuments(query);
      if (addresses) {
        res.status(200).json({ addresses, total });
      } else {
        res.status(404).json({ message: "Addresses not found" })
      }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get an address by ID
const getAddressByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const address = await Address.findById(id);
    if (address) {
      res.status(200).send({ address });
    } else {
      res.status(404).send({ message: "Address not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update an existing by ID
const updateAddressByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const address = await Address.findById(id).lean();
    if (address) {
      for (let item in req?.body) {
        address[item] = req?.body[item];
      }
      const updateAddress = await Address.findByIdAndUpdate(id, address, { new: true });
      if (updateAddress) {
        res.status(200).json({ address: updateAddress });
      } else {
        res.status(400).json({ message: "Address not updated" });
      }
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * function to delete an address by ID
const deleteAddressByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const address = await Address.findByIdAndDelete(id);
    if (address) {
      res.status(200).json({ message: "Address deleted successfully" });
    } else {
      res.status(400).json({ message: "Address not deleted" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressByID,
  updateAddressByID,
  deleteAddressByID,
};