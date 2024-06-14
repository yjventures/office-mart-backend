const ProductVariation = require("../db/product_variation");

// * Function to create a variation of product
const createProductVariation = async (variation) => {
  try {
    const variationObj = {};
    for (let item in variation) {
      if (item === "name" || item === "description") {
        const intlObj = {};
        if (variation[item].ac) {
          intlObj.ac = variation[item].ac;
        }
        if (variation[item].en) {
          intlObj.en = variation[item].en;
        }
        variationObj[item] = intlObj;
      } else {
        variationObj[item] = variation[item];
      }
    }
    const variationCollection = await new ProductVariation(variationObj);
    const newVariation = await variationCollection.save();
    if (newVariation) {
      return newVariation;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

// * Function to get all the variations
const getAllProductVariations = async () => {
  try {
    const allProductvariations = await ProductVariation.find({});
    if (allProductvariations) {
      return allProductvariations;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

// * Function to get a veriation by ID
const getProductVariationByID = async (id) => {
  try {
    const variation = await ProductVariation.findById(id);
    if (variation) {
      return variation;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

// * Function to update a variation by ID
const updateProductVariationByID = async (id, body, session = false) => {
  try {
    let variationObj = null;
    if (session) {
      variationObj = await ProductVariation.findById(id).session(session).lean();
    } else {
      variationObj = await ProductVariation.findById(id).lean();
    }
    if (variationObj) {
      for (let item in body) {
        if (item === "name" || item === "description") {
          if (body[item].ac) {
            variationObj[item].ac = body[item].ac;
          }
          if (body[item].en) {
            variationObj[item].en = body[item].en;
          }
        } else {
          variationObj[item] = body[item];
        }
      }
      let variation = null;
      if (session) {
        variation = await ProductVariation.findByIdAndUpdate(id, variationObj, {
          new: true,
          session,
        });
      } else {
        variation = await ProductVariation.findByIdAndUpdate(id, variationObj, {
          new: true,
        });
      }
      if (variation) {
        return variation;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

// * Function to delete a variation by ID
const deleteProductVariationByID = async (id) => {
  try {
    const delObj = await ProductVariation.findByIdAndDelete(id);
    if (delObj) {
      return delObj;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createProductVariation,
  getAllProductVariations,
  getProductVariationByID,
  updateProductVariationByID,
  deleteProductVariationByID,
};
