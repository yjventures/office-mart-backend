const mongoose = require("mongoose");
const mongooseIntl = require("mongoose-intl");

const childCategorySchema = mongoose.Schema(
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
    parents: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SellingCategory'
        }
      ],
      default: [],
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
const ChildCategory = mongoose.model(
  "ChildCategory",
  childCategorySchema
);
module.exports = ChildCategory;