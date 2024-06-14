const mongoose = require('mongoose');

const homeOfferImageSchema = mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false
    },
    offers: {
      type: [
        {
          image: {
            type: String,
          },
          category: {
            type: String,
          }
        }
      ],
      default: [],
    },
  }, {
    timestamps: true,
  }
);

const HomeOfferImage = mongoose.model('HomeOfferImage', homeOfferImageSchema);
module.exports = HomeOfferImage;