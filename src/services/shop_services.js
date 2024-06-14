const { validationResult } = require("express-validator");
const VendorInfo = require("../db/vendor_info");
const User = require("../db/user");
const Shop = require("../db/shop");
const SellingCategory = require("../db/selling_category");
const ShippingMethod = require("../db/shipping_method");

// * Function to create a shop info
const createShopInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const shopObj = {};
      const name = {
        en: "",
        ac: "",
      };
      const description = {
        en: "",
        ac: "",
      };
      const region = {
        en: "",
        ac: "",
      };
      const return_period = {
        en: "",
        ac: "",
      };
      const refund_policy = {
        en: "",
        ac: "",
      };
      const return_authorization_method = {
        en: "",
        ac: "",
      };
      const return_shipping_method = {
        en: "",
        ac: "",
      };
      if (req?.body?.name?.en) {
        name.en = req.body?.name?.en;
      }
      if (req?.body?.name?.ac) {
        name.ac = req.body?.name?.ac;
      }
      shopObj.name = name;
      if (req?.body?.phone) {
        shopObj.phone = req.body?.phone;
      }
      if (req?.body?.categories) {
        const categories = [];
        for (let item of req?.body?.categories) {
          let category = await SellingCategory.findOne({ name: item });
          categories.push(category._id);
        }
        shopObj.categories = categories;
      }
      if (req?.body?.region?.en) {
        region.en = req.body?.region?.en;
      }
      if (req?.body?.region?.ac) {
        region.ac = req.body?.region?.ac;
      }
      shopObj.region = region;
      if (req?.body?.description?.en) {
        description.en = req.body?.description?.en;
      }
      if (req?.body?.description?.ac) {
        description.ac = req.body?.description?.ac;
      }
      shopObj.description = description;
      if (req?.body?.logo) {
        shopObj.logo = req.body?.logo;
      }
      if (req?.body?.logo_mobile) {
        shopObj.logo_mobile = req.body?.logo_mobile;
      }
      if (req?.body?.banner) {
        shopObj.banner = req.body?.banner;
      }
      if (req?.body?.banner_mobile) {
        shopObj.banner_mobile = req.body?.banner_mobile;
      }
      if (req?.body?.product_banner) {
        shopObj.product_banner = req.body?.product_banner;
      }
      if (req?.body?.product_banner_mobile) {
        shopObj.product_banner_mobile = req.body?.product_banner_mobile;
      }
      if (req?.body?.links) {
        shopObj.links = req.body?.links;
      }
      if (req?.body?.shipping_method) {
        const method = await ShippingMethod.findOne({
          name: req.body.shipping_method,
        });
        shopObj.shipping_method = method;
      }
      if (req?.body?.return_period?.en) {
        return_period.en = req.body?.return_period?.en;
      }
      if (req?.body?.return_period?.ac) {
        return_period.ac = req.body?.return_period?.ac;
      }
      shopObj.return_period = return_period;
      if (req?.body?.refund_policy?.en) {
        refund_policy.en = req.body?.refund_policy?.en;
      }
      if (req?.body?.refund_policy?.ac) {
        refund_policy.ac = req.body?.refund_policy?.ac;
      }
      shopObj.refund_policy = refund_policy;
      if (req?.body?.return_authorization_method?.en) {
        return_authorization_method.en =
          req.body?.return_authorization_method?.en;
      }
      if (req?.body?.return_authorization_method?.ac) {
        return_authorization_method.ac =
          req.body?.return_authorization_method?.ac;
      }
      shopObj.return_authorization_method = return_authorization_method;
      if (req?.body?.return_shipping_method?.en) {
        return_shipping_method.en = req.body?.return_shipping_method?.en;
      }
      if (req?.body?.return_shipping_method?.ac) {
        return_shipping_method.ac = req.body?.return_shipping_method?.ac;
      }
      shopObj.return_shipping_method = return_shipping_method;
      const shopCollection = await new Shop(shopObj);
      const shop = await shopCollection.save();
      if (shop) {
        if (req?.body?.vendor_id) {
          const vendorId = await VendorInfo.findByIdAndUpdate(
            req?.body?.vendor_id,
            { shop: shop._id },
            { new: true }
          );
          res.status(200).json({ vendor: vendorId });
        } else {
          res.status(400).json({ message: "Vendor could not be found" });
        }
      } else {
        res.status(400).json({ message: "Shop could not be created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all shop info
const getAllShopInfo = async (req, res) => {
  try {
    const query = {};
    let page = 1;
    let limit = 10;
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
      } else if (item === "tags") {
        query.tags = { $in: req.query[item] };
      } else if (item === 'name' || item === 'description') {
        query[`${item}.en`] = { $regex: req.query[item] };
      } else {
        query[item] = req.query[item];
      }
    }
    const allShopInfo = await Shop.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await Shop.countDocuments(query);
    if (allShopInfo.length > 0) {
      res.status(200).json({ shop: allShopInfo, total: count });
    } else {
      res.status(200).json({ shop: [] });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a shop info by ID
const getShopInfoByID = async (req, res) => {
  try {
    const shopID = req?.params?.id;
    const shop = await Shop.findById(shopID);
    if (shop) {
      res.status(200).json({ shop });
    } else {
      res.status(400).json({ message: "Shop could not be found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a shop info
const updateShopInfoByID = async (req, res) => {
  try {
    const shopInfo = await Shop.findById(req?.params?.id).lean();
    if (shopInfo) {
      for (let item in req?.body) {
        if (
          item === "name" ||
          item === "description" ||
          item === "region" ||
          item === "return_period" ||
          item === "refund_policy" ||
          item === "return_authorization_method" ||
          item === "return_shipping_method"
        ) {
          if (req.body[item].ac) {
            shopInfo[item].ac = req.body[item].ac;
          }
          if (req.body[item].en) {
            shopInfo[item].en = req.body[item].en;
          }
        } else if (item === "categories") {
          const categories = [];
          for (let val of req?.body?.categories) {
            let category = await SellingCategory.findOne({ name: val });
            categories.push(category._id);
          }
          shopInfo.categories = categories;
        } else if (item === "shipping_method") {
          const method = await ShippingMethod.findOne({
            name: req.body.shipping_method,
          });
          shopInfo.shipping_method = method;
        } else {
          shopInfo[item] = req.body[item];
        }
      }
      const shop = await Shop.findByIdAndUpdate(req?.params?.id, shopInfo, {
        new: true,
      });
      res.status(200).json({ shop });
    } else {
      res.status(400).json({ message: "Shop could not be found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteShop = async (id) => {
  try {
    const shop = await Shop.findByIdAndDelete(id);
  } catch (err) {
    throw new Error({ message: "Delete failed" });
  }
};

// * Function to delete a customer info
const deleteShopByID = async (req, res) => {
  try {
    await deleteShop(req?.params?.id);
    res.status(200).json({ message: "Customer info deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a user by shop ID
const findUserByShopID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const vendor_info = await VendorInfo.findOne({ shop: req?.body?.shop });
      if (vendor_info) {
        const user = await User.findOne({ vendor_info: vendor_info._id });
        if (user) {
          res.status(200).json({ user });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } else {
        res.status(404).json({ message: "Vendor information not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createShopInfo,
  getAllShopInfo,
  getShopInfoByID,
  updateShopInfoByID,
  deleteShopByID,
  findUserByShopID,
};
