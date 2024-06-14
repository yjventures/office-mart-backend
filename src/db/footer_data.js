const mongoose = require('mongoose');
const mongooseIntl = require("mongoose-intl");

const footerDataSchema = mongoose.Schema(
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
    second_column: {
      type: {
        heading_name: {
          type: String,
          default: '',
          intl: true,
        },
        items: {
          type: [
            {
              name: {
                type: String,
                intl: true,
              },
              link: {
                type: String,
              }
            }
          ],
          default: []
        }
      }
    },
    third_column: {
      type: {
        heading_name: {
          type: String,
          default: '',
          intl: true,
        },
        items: {
          type: [
            {
              name: {
                type: String,
                intl: true,
              },
              link: {
                type: String,
              }
            }
          ],
          default: []
        }
      }
    },
    fourth_column: {
      type: {
        heading_name: {
          type: String,
          default: '',
          intl: true,
        },
        items: {
          type: [
            {
              name: {
                type: String,
                intl: true,
              },
              link: {
                type: String,
              }
            }
          ],
          default: []
        }
      }
    },
  }, {
    timestamps: true,
  }
);

mongoose.plugin(mongooseIntl, {
  languages: ["en", "ac"],
  defaultLanguage: "en",
});
const FooterData = mongoose.model('FooterData', footerDataSchema);
module.exports = FooterData;