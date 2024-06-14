const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const generalDataSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    text_logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    slider: {
      type: [
        {
          image: {
            type: String,
          },
          banner_text: {
            type: String,
          },
          banner_text_color: {
            type: String,
          },
        }
      ],
      default: [],
    },
    header_welcome_text: {
      type: String,
      default: '',
      intl: true,
    },
    event_enabled: {
      type: Boolean,
      default: false,
    },
    event: {
      type: {
        first_name: {
          type: String,
          default: '',
        },
        last_name: {
          type: String,
          default: '',
        },
        percentage: {
          type: Number,
          default: 0,
        }
      },
    }
  }, {
    timestamps: true,
  }
);

mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const GeneralData = mongoose.model('GeneralData', generalDataSchema);
module.exports = GeneralData;