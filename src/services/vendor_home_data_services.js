const VendorHomeData = require('../db/vendor_home_data');
const { userType } = require("../utils/enums");

// * Function to create vendor home data
const createVendorHomeData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const vendorHomeDataObject = {};
      for (let item in req?.body) {
        vendorHomeDataObject[item] = req.body[item];
      }
      const vendorHomeDataCollection = await new VendorHomeData(vendorHomeDataObject);
      const vendorHomeData = await vendorHomeDataCollection.save();
      if (vendorHomeData) {
        res.status(200).json({ vendor_home_data: vendorHomeData });
      } else {
        res.status(404).json({ message: "Vendor home data not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get vendor home data using querystring
const getVendorHomeData = async (req, res) => {
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
    const allVendorHomeData = await VendorHomeData.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await VendorHomeData.countDocuments(query);
    if (allVendorHomeData) {
      res.status(200).json({ vendor_home_data: allVendorHomeData, total: count });
    } else {
      res.status(404).json({ message: "Vendor home data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get vendor home data using ID
const getVendorHomeDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const vendor_home_data = await VendorHomeData.findById(id);
    if (vendor_home_data) {
      res.status(200).json({ vendor_home_data });
    } else {
      res.status(404).json({ message: "Vendor home data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update vendor home data using ID
const updateVendorHomeDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const vendor_home_data = await VendorHomeData.findById(id).lean();
      for (let item in req?.body) {
        for (let el in req?.body[item]) {
          vendor_home_data[item][el] = req.body[item][el];
        }
      }
      const vendorHomeData = await VendorHomeData.findByIdAndUpdate(
        id,
        vendor_home_data,
        {
          new: true,
        }
      );
      if (vendorHomeData) {
        res.status(200).json({ vendor_home_data: vendorHomeData });
      } else {
        res.status(404).json({ message: "Vendor home data not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete vendor home data using ID
const deleteVendorHomeDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const vendor_home_data = await VendorHomeData.findById(id);
      if (vendor_home_data) {
        await VendorHomeData.findByIdAndDelete(id);
        res
          .status(200)
          .json({ message: "Vendor home data deleted successfully" });
      } else {
        res.status(404).json({ message: "Vendor home data not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createVendorHomeData,
  getVendorHomeData,
  getVendorHomeDataByID,
  updateVendorHomeDataByID,
  deleteVendorHomeDataByID,
};