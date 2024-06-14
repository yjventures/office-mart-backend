const mongoose = require('mongoose');

const socialListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    app_link: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
  }, {
    timestamps: true,
  }
);

const SocialList = mongoose.model('SocialList', socialListSchema);
module.exports = SocialList;