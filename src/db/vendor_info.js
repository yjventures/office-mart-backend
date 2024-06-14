const mongoose = require('mongoose');

const vendorInfoSchema = mongoose.Schema(
    {
        business_name: {
            type: String,
            required: true,
            trim: true,
            intl: true,
        },
        backgorund_image: { 
            type: String,
        },
        business_email: {
            type: String,
        },
        business_phone_no: {
            type: String,
        },
        business_reg_number: {
            type: String,
            required: true,
            trim: true,
        },
        tin_number: {
            type: String,
            trim: true,
        },
        docs: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Doc',
                    autopopulate: { maxDepth: 2 },
                }
            ],
            default: [],
            autopopulate: { maxDepth: 2 },
        },
        selling_categories: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'SellingCategory',
                    autopopulate: { maxDepth: 2 },
                }
            ]
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            autopopulate: { maxDepth: 2 } ,
        },
        tags: {
            type: Array,
            default: [],
        },
        region: {
            type: String,
            intl: true,
        },
        main_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SellingCategory',
            autopopulate: { maxDepth: 2 },
        }
    },
    {
        timestamps: true,
    }
);

vendorInfoSchema.plugin(require('mongoose-autopopulate'));
const VendorInfo = mongoose.model('VendorInfo', vendorInfoSchema);
module.exports = VendorInfo;