const mongoose = require("mongoose");
const mongooseIntl = require("mongoose-intl");

const sellingCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
      intl: true,
    },
    image: {
      type: String,
      default: '',
    },
    weight_matrics: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const SellingCategory = mongoose.model(
  "SellingCategory",
  sellingCategorySchema
);
module.exports = SellingCategory;
