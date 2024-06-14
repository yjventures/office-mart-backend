const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const refundSettingSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed']
    },
    reasons: {
      type: [
        {
          title: {
            type: String,
            intl: true,
          }
        }
      ],
      default: []
    }
  }, {
    timestamps: true
  }
);

mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const RefundSetting = mongoose.model('RefundSetting', refundSettingSchema);
module.exports = RefundSetting;