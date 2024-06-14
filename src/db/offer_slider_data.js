const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const officeSliderDataSchema = mongoose.Schema(
  {
    enabled: {
      type: String,
      default: '',
    },
    items: {
      type: [
        {
          title: {
            type: String,
            intl: true,
          },
          description: {
            type: String,
            intl: true,
          },
          image: {
            type: String,
          }
        }
      ],
      default: []
    }
  }, {
    timestamps: true,
  }
);

mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const OfficeSliderData = mongoose.model('OfficeSliderData', officeSliderDataSchema);
module.exports = OfficeSliderData;

