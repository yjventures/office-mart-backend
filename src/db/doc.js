const mongoose = require("mongoose");

const docSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      intl: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doc = mongoose.model("Doc", docSchema);
module.exports = Doc;
