const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const motivationBoxDataSchema = mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
      intl: true,
    },
    subtitle: {
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
const MotivationBoxData = mongoose.model('MotivationBoxData', motivationBoxDataSchema);
module.exports = MotivationBoxData;