const mongoose = require("mongoose");

const platformFeeSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PlatformFee = mongoose.model("PlatformFee", platformFeeSchema);
module.exports = PlatformFee;
