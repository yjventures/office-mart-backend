const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstname: {
          type: String,
          required: true,
          trim: true,
        },
        lastname: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
        },
        phone: {
          type: String,
        },
        image: {
            type: String,
        },
        is_verified:{
          type: Boolean,
          default: false,
        },
        is_first_time: {
          type: Boolean,
          default: true,
          when: { type: 'vendor' },
        },
        is_approved: {
          type: Boolean,
          default: false,
          when: { type: 'vendor' },
        },
        is_rejected: {
          type: Boolean,
          default: false,
          when: { type: 'vendor' },
        },
        birthdate: {
          type: Date,
        },
        type: {
          type: String,
          enum: ['admin', 'customer', 'vendor', 'super-admin'],
          default: 'customer',
        },
        customer_info: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'CustomerInfo',
          when: { type: 'customer'},
          autopopulate: { maxDepth: 4 },
        },
        vendor_info: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'VendorInfo',
          when: { type: 'vendor' },
          autopopulate: { maxDepth: 4 },
        },
        admin_info: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AdminInfo',
          when: { type: 'admin' },
          autopopulate: { maxDepth: 4 },
        },
        reviews: {
          type: Array,
          default: [],
        },
        orders: {
          type: Number,
          default: 0,
        },
        fcm_tokens: {
          type: [
            {
              type: String
            }
          ],
          default: [],
        }
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(require('mongoose-autopopulate'));
const User = mongoose.model('User', userSchema);
module.exports = User;