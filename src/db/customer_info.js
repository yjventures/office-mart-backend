const mongoose = require("mongoose");

const customerInfoSchema = mongoose.Schema(
  {
    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      autopopulate: { maxDepth: 1 },
    },
    billing_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
			autopopulate: { maxDepth: 1 },
    },
    saved_addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        autopopulate: { maxDepth: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

customerInfoSchema.plugin(require('mongoose-autopopulate'));
const CustomerInfo = mongoose.model("CustomerInfo", customerInfoSchema);
module.exports = CustomerInfo;
