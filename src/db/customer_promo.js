const mongoose = require('mongoose');

const customerPromoSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    code: {
      type: String,
      required: true
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
    },    
    count: {
      type: Number,
      default: 1
    }
  }, {
    timestamps: true,
  }
);

const CustomerPromo = mongoose.model('CustomerPromo', customerPromoSchema);
module.exports = CustomerPromo;