const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const vendorHomeTitleSchema = mongoose.Schema(
  {
    vendor_home_title: {
      type: String,
      default: '',
      intl: true,
    },
  }, {
    timestamps: true,
  }
);

mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const VendorHomeTitle = mongoose.model('VendorHomeTitle', vendorHomeTitleSchema);
module.exports = VendorHomeTitle;