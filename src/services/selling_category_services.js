const { validationResult } = require("express-validator");
const SellingCategory = require("../db/selling_category");
const { userType } = require("../utils/enums");

// * Function to crate a category
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.ststus(400).json({ message: "You have to be admin" });
    } else {
      const categoryObj = {};
      for (let item in req?.body) {
        categoryObj[item] = req.body[item];
      }
      const categoryCollection = await new SellingCategory(categoryObj);
      const category = await categoryCollection.save();
      if (category) {
        res.status(200).json({ category });
      } else {
        res.status(400).json({ message: "Catagory could not be created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all categories using querystring
const getAllCategories = async (req, res) => {
  try {
    const query = {};
    let limit = 100, page = 1;
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
      } else if (item === 'sortBy') {
        sortBy = req?.query[item];
      } else {
        query[item] = req.query[item];
      }
    }
    const categories = await SellingCategory.find(query).sort(sortBy).skip((page - 1) * limit).limit(limit);
    const total = await SellingCategory.countDocuments(query);
    if (categories) {
      res.status(200).send({ categories, total });
    } else {
      res.status(404).json({ message: "No category found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Somrthing went wrong" });
  }
};

// * Function to get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const id = req?.params?.id;
    const category = await SellingCategory.findById(id).lean();
    if (category) {
      category.weight_matrics++;
      const updatedCategory = await SellingCategory.findByIdAndUpdate(id, category, {new: true});
      res.status(200).json({ category });
    } else {
      res.status(404).json({ message: "No category found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a category by ID
const updateCategoryById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.ststus(400).json({ message: "You have to be admin" });
    } else {
      const id = req?.params?.id;
      const category = await SellingCategory.findById(id);
      if (category) {
        for (let item in req?.body) {
          if (item === "title") {
            if (req?.body?.title?.en) {
              category.title.en = req?.body?.title?.en;
            }
            if (req?.body?.title?.ac) {
              category.title.ac = req?.body?.title?.ac;
            }
          } else {
            category[item] = req?.body[item];
          }
        }
        const updatedCategory = await SellingCategory.findByIdAndUpdate(
          id,
          category,
          { new: true }
        );
        if (updatedCategory) {
          res.status(200).json({ category: updatedCategory });
        } else {
          res.status(400).json({ message: "Catagory could not be updated" });
        }
      } else {
        res.status(404).json({ message: "No category found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete a category by ID
const deleteCategoryById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.ststus(400).json({ message: "You have to be admin" });
    } else {
      const id = req?.params?.id;
      const category = await SellingCategory.findById(id);
      if (category) {
        const deletedCategory = await SellingCategory.findByIdAndDelete(id);
        if (deletedCategory) {
          res.status(200).json({ message: "Deleted category successfully" });
        } else {
          res.status(400).json({ message: "Catagory could not be deleted" });
        }
      } else {
        res.status(404).json({ message: "No category found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
