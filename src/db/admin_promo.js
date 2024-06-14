const mongoose = require('mongoose');

const adminPromoSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    expiration_date: {
      type: Date,
      default: null
    },
    amount: {
      type: Number,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    },
    is_percent: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 1
    }
  }, {
    timestamps: true,
  }
);

const AdminPromo = mongoose.model('AdminPromo', adminPromoSchema);
module.exports = AdminPromo;