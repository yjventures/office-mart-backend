const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Product = require("../db/product");
const Review = require("../db/review");
const Brand = require("../db/brand");
const SellingCategory = require("../db/selling_category");
const {
  createProductVariation,
  updateProductVariationByID,
  deleteProductVariationByID,
} = require("./product_variation_services");
const { excelToJson } = require("../utils/read_from_excel");
const { csvToJson } = require("../utils/read_from_csv");
const { capitalizeFirstLetter } = require("../common/string_helper");
const { createBrandHelper } = require("./brand_services");
require("dotenv").config();

// * Function to create a product
const createProduct = async (body) => {
  try {
    const productObj = {};
    for (let item in body) {
      if (item === "name" || item === "description") {
        const intlObj = {};
        if (body[item].ac) {
          intlObj.ac = body[item].ac;
        }
        if (body[item].en) {
          intlObj.en = body[item].en;
        }
        productObj[item] = intlObj;
      } else if (item === "main_category") {
        const category = await SellingCategory.findOne({
          name: body.main_category,
        });
        productObj.main_category = category;
      } else if (item === "variations") {
        const variations = [];
        for (let element of body.variations) {
          const variant = await createProductVariation(element);
          variations.push(variant);
        }
        if (variations.length > 0) {
          productObj.variations = variations;
        }
      } else if (item === "brand") {
        const brandName = capitalizeFirstLetter(body?.brand);
        let brand = await Brand.findOne({ name: brandName });
        if (brand) {
          productObj.brand = brandName;
        } else {
          brand = await createBrandHelper({ name: brandName });
          if (brand) {
            productObj.brand = brandName;
          } else {
            throw new Error({ message: "Couldn't create brand" });
          }
        }
      } else {
        productObj[item] = body[item];
      }
    }
    return productObj;
  } catch (err) {
    throw err;
  }
};

// * Function to create a product info
const createProductInfo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const productObj = await createProduct(req?.body);
      const productCollection = await new Product(productObj);
      const product = await productCollection.save();
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(404).json({ message: "Product was not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all product info using query string
const getAllProductInfo = async (req, res) => {
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
    const allProductInfo = await Product.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await Product.countDocuments(query);
    if (allProductInfo.length > 0) {
      res.status(200).json({ product_info: allProductInfo, total: count });
    } else {
      res.status(200).json({ product_info: [] });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a product info by ID
const getProductInfoByID = async (req, res) => {
  try {
    const productInfoID = req?.params?.id;
    const updateProduct = await Product.findByIdAndUpdate(
      productInfoID,
      { $inc: { weight_matrics: 0.5, view: 1  } },
      { new: true }
    );
    const productInfo = await Product.findById(productInfoID);
    if (productInfo) {
      res.status(200).json({ productInfo });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a product
const updateProduct = async (body, product, session = false) => {
  try {
    const productInfo = await Product.findById(product).lean();
    for (let item in body) {
      if (item === "name" || item === "description") {
        if (body[item].ac) {
          productInfo[item].ac = body[item].ac;
        }
        if (body[item].en) {
          productInfo[item].en = body[item].en;
        }
      } else if (item === "main_category") {
        if (session) {
          productInfo.main_category = await SellingCategory.findOne({
            name: body.main_category,
          }).session(session);
        }
        productInfo.main_category = await SellingCategory.findOne({
          name: body.main_category,
        });
      } else if (item === "variations") {
        for (let variation of body.variations) {
          if (variation) {
            const variant = await updateProductVariationByID(
              variation._id,
              variation,
              session
            );
          }
        }
      } else if (item === "related_product") {
        productInfo.related_products.push(body.related_product);
      } else if (item === "brand") {
        const brandName = capitalizeFirstLetter(body?.brand);
        let brand = await Brand.findOne({ name: brandName });
        if (brand) {
          productInfo.brand = brandName;
        } else {
          brand = await createBrandHelper({ name: brandName }, session);
          if (brand) {
            productInfo.brand = brandName;
          } else {
            throw new Error({ message: "Couldn't create brand" });
          }
        }
      } else {
        productInfo[item] = body[item];
      }
    }
    let productObj = null;
    if (session) {
      productObj = await Product.findByIdAndUpdate(
        product,
        productInfo,
        { new: true, session }
      );
    } else {
      productObj = await Product.findByIdAndUpdate(
        product,
        productInfo,
        { new: true }
      );
    }
    return productObj;
  } catch (err) {
    throw err;
  }
};

// * Function to update a product info
const updateProductInfoByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const product = await updateProduct(req?.body, req?.params?.id);   
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(404).json({ message: "Product could not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteProduct = async (id) => {
  try {
    const productInfo = await Product.findByIdAndDelete(id);
    if (productInfo?.variations) {
      for (let item of productInfo.variations) {
        await deleteProductVariationByID(item._id);
      }
    }
    if (productInfo) {
      return productInfo;
    } else {
      return null;
    }
  } catch (err) {
    throw new Error({ message: "Delete failed" });
  }
};

// * Function to delete a product info
const deleteProductInfoByID = async (req, res) => {
  try {
    await deleteProduct(req?.params?.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get product by rating
const getProductsByRatings = async (products, rating) => {
  const reviews = await Review.aggregate([
    { $match: { product_id: { $in: products } } },
    {
      $group: {
        _id: "$product_id",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  if (rating[0] !== 5 && rating[rating.length - 1] === rating[0]) {
    rating[0] += 0.0001;
  }

  const filteredProductIds = reviews
    .filter(
      (review) =>
        review.averageRating >= rating[rating.length - 1] && review.averageRating <= Math.ceil(rating[0])
    )
    .map((review) => review._id);

  const newProducts = await Product.find({ _id: { $in: filteredProductIds } });
  return newProducts;
};

// * Function to filter products
const filterProduct = async (req, res) => {
  try {
    let sortBy = "createdAt";
    const query = {};
    if ("low_price" in req?.body && "high_price" in req?.body) {
      query.price = { $gte: req?.body?.low_price, $lte: req?.body?.high_price };
    }
    if (req?.body?.brands) {
      query.brand = { $in: req?.body?.brands };
    }
    if (req?.body?.on_sale) {
      query.on_sale = true;
    }
    if (req?.body?.in_stock) {
      query.quantity = { $gt: 0 };
    }
    if (req?.body?.featured) {
      query.featured = true;
    }
    if (req?.body?.tags) {
      query.tags = { $elemMatch: { $in: req.body.tags } };
    }
    if (req?.body?.colors) {
      query.color = { $elemMatch: { $in: req.body.colors } };
    }
    if (req?.body?.categories) {
      const category_ids = [];
      for (let item of req?.body?.categories) {
        const category = await SellingCategory.findOne({ name: item }).lean();
        if (category) {
          category_ids.push(category._id);
        }
      }
      query.main_category = { $in: category_ids };
    }
    if (req?.body?.shop) {
      query.shop = new mongoose.Types.ObjectId(req.body.shop);
    }
    if (req?.body?.name) {
      query['name.en'] = new RegExp(req.body.name.en, 'i');
    }
    if (req?.body?.sortBy) {
      sortBy = req.body.sortBy;
    }
    query.is_published = true;
    query.draft = false;
    const products = await Product.find(query).sort(sortBy).lean();
    if (req?.body?.rating && products) {
      const productIds = products.map(product => product._id);
      const productsWithRatings = await getProductsByRatings(
        productIds,
        req?.body?.rating
      );
      res.status(200).json({ products: productsWithRatings });
    } else if (products) {
      res.status(200).json({ products });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const makeExcelToProductObject = (items) => {
  try {
    const dimentionTags = [
      "width",
      "height",
      "length",
      "weight",
      "length_unit",
      "width_unit",
      "height_unit",
      "weight_unit",
    ];
    const dimentions = {
      width: 0,
      length: 0,
      weight: 0,
      height: 0,
      length_unit: "in",
      width_unit: "in",
      height_unit: "in",
      weight_unit: "gm",
    };
    const product = {};
    for (let item in items) {
      if (dimentionTags.find((tag) => tag === item)) {
        dimentions[item] = items[item];
      } else if (item === "name" || item === "description") {
        product[item] = { en: items[item] };
      } else if (item === "images" || item === "color") {
        product[item] = items[item].split(", ");
      } else {
        product[item] = items[item];
      }
    }
    product.dimentions = dimentions;
    return product;
  } catch (err) {
    throw err;
  }
};

const productBulkUpload = async (req, res) => {
  try {
    const fullPath = path.join(
      process.env.BULK_PRODUCT_FILE_LOCATION,
      req.file.filename
    );
    const productExtension = req.file.filename.split(".")[1];
    let productArray = [];
    if (productExtension === "xlsx" || productExtension === "xls") {
      productArray = excelToJson(fullPath);
    } else if (productExtension === "csv") {
      productArray = await csvToJson(fullPath);
    }
    fs.unlinkSync(fullPath);
    for (let item of productArray) {
      item.shop = req?.params?.id;
      const product = makeExcelToProductObject(item);
      const productObj = await createProduct(product);
      const productCollection = await new Product(productObj);
      await productCollection.save();
    }
    res.status(200).json({ message: "Products creation done" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete variations from product by ID
const deleteVariationsByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const productInfo = await Product.findById(id).lean();
    if (productInfo?.variations) {
      for (let item of productInfo.variations) {
        await deleteProductVariationByID(item._id);
      }
    }
    productInfo.variations = [];
    const updatedProduct = await Product.findByIdAndUpdate(id, productInfo, { new: true });
    if (updatedProduct) {
      res.status(200).json({ product: updatedProduct });
    } else {
      res.status(404).json({ message: "Product could not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to add variations by ID
const addVariationsByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const productInfo = await Product.findById(id).lean();
    for (let element of req?.body?.variations) {
      const variant = await createProductVariation(element);
      productInfo.variations.push(variant);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, productInfo, { new: true });
    if (updatedProduct) {
      res.status(200).json({ product: updatedProduct });
    } else {
      res.status(404).json({ message: "Product could not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get top products
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({shop: req?.query?.shop}).sort({ order_matrics: -1}).limit(req?.query?.limit);
    if (products) {
      res.status(200).json({ products });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createProductInfo,
  getAllProductInfo,
  getProductInfoByID,
  updateProduct,
  updateProductInfoByID,
  deleteProductInfoByID,
  filterProduct,
  productBulkUpload,
  deleteVariationsByID,
  addVariationsByID,
  getTopProducts,
};
