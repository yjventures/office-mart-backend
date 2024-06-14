const mongoose = require('mongoose');

const topBarDataSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    left: {
      type: [
        {
          name: {
            type: String,
            default: '',
          },
          link: {
            type: String,
            default: '',
          },
          icon: {
            type: String,
            default: '',
          },
        }
      ]
    },
    right: {
      type: {
        phone: {
          type: String,
          default: '',
        },
        email: {
          type: String,
          default: '',
        }
      }
    },
  }, {
    timestamps: true,
  }
);

const TopBarData = mongoose.model('TopBarData', topBarDataSchema);
module.exports = TopBarData;