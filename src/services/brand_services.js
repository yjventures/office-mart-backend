const { validationResult } = require("express-validator");
const Brand = require("../db/brand");
const { userType } = require("../utils/enums");

// * Helper function to create a brand
const createBrandHelper = async (body, session = false) => {
  try {
    const brandObj = {};
      for (let item in body) {
        brandObj[item] = body[item];
      }
      const brandCollection = await new Brand(brandObj);
      let brand = null;
      if (session) {
        brand = await brandCollection.save({ session });
      } else {
        brand = await brandCollection.save();
      }
      return brand;
  } catch (err) {
    throw err;
  }
};

// * Function to create a brand
const createBrand = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (req.user.type === userType.CUSTOMER) {
      res.status(400).json({ message: "User cannot create brand" });
    } else {
      const brand = await createBrandHelper(req?.body);
      if (brand) {
        res.status(200).json({ brand });
      } else {
        res.status(404).json({ message: "Brand can't be created." });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all brand using querystring
const getAllBrands = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const query = {};
      let limit = 10;
      let page = 1;
      let sortBy = "name";
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
      const brands = await Brand.find(query)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit);
      if (brands) {
        const total = await Brand.countDocuments(query);
        res.status(200).json({ brands, total });
      } else {
        res.status(404).json({ message: "Brands not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get brand by ID
const getBrandByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const brandOrder = await Brand.findById(id);
    if (brandOrder) {
      res.status(200).json({ brand_order: brandOrder });
    } else {
      res.status(404).json({ message: "Brand not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update brand by ID
const updateBrandByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (req.user.type === userType.CUSTOMER) {
      res.status(400).json({ message: "User cannot update brand" });
    } else {
      const id = req?.params?.id;
      const brandObj = await Brand.findById(id).lean();
      if (brandObj) {
        for (let item in req?.body) {
          brandObj[item] = req?.body[item];
        }
        const updatedBrand = await Brand.findByIdAndUpdate(id, brandObj, { new: true });
        if (updatedBrand) {
          res.status(200).json({ brand: updatedBrand });
        } else {
          res.status(400).json({ message: "Brand can't be updated" })
        }
      } else {
        res.status(404).json({ message: "Brand not found" });
      }
    }
  } catch (err) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

// * Function to delete brand by ID
const deleteBrandByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (deletedBrand) {
      res.status(200).json({ message: 'Brand is deleted' });
    } else {
      res.status(404).json({ message: 'Brand not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  createBrandHelper,
  createBrand,
  getAllBrands,
  getBrandByID,
  updateBrandByID,
  deleteBrandByID,
};
