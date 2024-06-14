const mongoose = require("mongoose");
const mongooseIntl = require("mongoose-intl");

const shopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      intl: true,
      unique: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SellingCategory",
          autopopulate: { maxDepth: 2 },
          default: null
        },
      ],
    },
    description: {
      type: String,
      intl: true,
      default: ''
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      autopopulate: { maxDepth: 2 },
      default: null
    },
    region: {
      type: String,
      trim: true,
      intl: true,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    logo_mobile: {
      type: String,
      default: ''
    },
    banner: {
      type: String,
      default: ''
    },
    banner_mobile: {
      type: String,
      default: ''
    },
    product_banner: {
      type: String,
      default: ''
    },
    product_banner_mobile: {
      type: String,
      default: ''
    },
    links: {
      type: [
        {
          type: String
        }
      ],
      default: []
    },
    shipping_method: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingMethod',
      default: null,
      autopopulate: { maxDepth: 2 },
    },
    return_period: {
      type: String,
      default: '',
      intl: true
    },
    refund_policy: {
      type: String,
      default: '',
      intl: true
    },
    return_authorization_method: {
      type: String,
      default: '',
      intl: true
    },
    return_shipping_method: {
      type: String,
      default: '',
      intl: true
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.plugin(require("mongoose-autopopulate"));
mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
