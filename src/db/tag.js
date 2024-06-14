const mongoose = require('mongoose');

const tagSchema = mongoose.Schema(
  {
      name: {
        type: String,
        required: true,
        trim: true,
        intl: true,
      },
  },
  {
      timestamps: true,
  }
);

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
