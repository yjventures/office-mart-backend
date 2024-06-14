const { validationResult } = require("express-validator");
const User = require("../db/user");
const VendorInfo = require("../db/vendor_info");
const Doc = require("../db/doc");
const SellingCategory = require("../db/selling_category");

// * Function to create a vendor info
const createVendorInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const infoObj = {
        business_name: req?.body?.business_name,
        business_reg_number: req?.body?.business_reg_number,
        region: req?.body?.region,
        business_phone_no: req?.body?.business_phone_no,
        business_email: req?.body?.business_email,
      };
      if (req?.body?.business_reg_certificate_link) {
        const regObj = {
          name: "Business Regestration Certificate",
          file: req?.body?.business_reg_certificate_link,
        };
        const bizRegCertificate = await new Doc(regObj);
        const newCertificate = await bizRegCertificate.save();
        if (!infoObj.docs) {
          infoObj.docs = [];
        }
        infoObj.docs.push(newCertificate._id);
      }
      if (req?.body?.tin_number) {
        infoObj.tin_number = req?.body?.tin_number;
      }
      if (req?.body?.tin_certificate_link) {
        const tinObj = {
          name: "Tin Certificate",
          file: req?.body?.tin_certificate_link,
        };
        const tinCertificate = await new Doc(tinObj);
        const newCertificate = await tinCertificate.save();
        if (!infoObj.docs) {
          infoObj.docs = [];
        }
        infoObj.docs.push(newCertificate._id);
      }

      if (req?.body?.main_category) {
        const mainCategoryString = req?.body?.main_category;
        const mainCategory = await SellingCategory.findOne({
          name: mainCategoryString,
        });
        infoObj.main_category = mainCategory ? mainCategory._id : null;
      }

      const vendor = await new VendorInfo(infoObj);
      const newVendor = await vendor.save();
      const updatedUser = await User.findByIdAndUpdate(
        req?.body?.userId,
        { vendor_info: newVendor._id },
        { new: true }
      );
      res.status(200).json({ user: updatedUser });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all Vendor info
const getAllVendorInfo = async (req, res) => {
  try {
    const allVendorInfo = await VendorInfo.find({});
    res.status(200).json({ vendors: allVendorInfo });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a Vendor info
const getVendorInfoByID = async (req, res) => {
  try {
    const vendorInfoID = req?.params?.id;
    const vendorInfo = await VendorInfo.findById(vendorInfoID);
    res.status(200).json({ vendorInfo });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a Vendor info
const updateVendorInfoByID = async (req, res) => {
  try {
    const vendorInfo = {};
    for (let item in req?.body) {
      if (item === "main_category") {
        const category = await SellingCategory.findOne({
          name: req.body[item],
        });
        vendorInfo[item] = category ? category._id : null;
      } else if (item === "selling_category") {
        vendorInfo[item] = [];
        for (let category of req.body[item]) {
          const categoryInfo = await SellingCategory.findOne({
            name: category,
          });
          if (categoryInfo) {
            vendorInfo[item].push(categoryInfo._id);
          }
        }
      } else {
        vendorInfo[item] = req.body[item]; // pore
      }
    }
    const updatedVendorInfo = await VendorInfo.findByIdAndUpdate(
      req?.params?.id,
      vendorInfo,
      { new: true }
    );
    const updatedUser = await User.findByIdAndUpdate(
      req?.body?.userId,
      { vendor_info: updatedVendorInfo._id },
      { new: true }
    );
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteVendor = async (id) => {
  try {
    const vendorInfo = await VendorInfo.findByIdAndDelete(id);
    vendorInfo.docs.forEach(async (element) => {
      await Doc.findByIdAndDelete(element);
    });
    return true;
  } catch (err) {
    throw new Error({ message: 'Deletion failed' });
  }
};

// * Function to delete a Vendor info
const deleteVendorInfoByID = async (req, res) => {
  try {
    const state = deleteVendor(req?.params?.id);
    res.status(200).json({ message: "Vendor Info is deleted" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createVendorInfo,
  getAllVendorInfo,
  getVendorInfoByID,
  updateVendorInfoByID,
  deleteVendorInfoByID,
  deleteVendor,
};
