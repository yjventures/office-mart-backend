const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('events').EventEmitter.defaultMaxListeners = 100;

const app = express();

app.use(bodyParser.json());
app.use(cors());

// logger middleware
app.use((req,res,next) =>{
    req.time = new Date(Date.now()).toString();
    res.on("finish", function() {
        console.log(req.method,req.hostname, req.path, res.statusCode, res.statusMessage, req.time,);
    });
    next();
});


// ? API to check connection to servers
app.get('/', (req, res) => {
    try {
        res.status(200).json({ mesage: 'Connections are established' });
    } catch (err) {
        res.status(500).json({ mesage: 'Connections are not established' });
    }
});

// ~ Router for authentication controller
app.use('/auth', require('../routers/auth_controller'));

// ~ Router for user controller
app.use('/users', require('../routers/user_controller'));

// ~ Router for vendor info controller
app.use('/vendors', require('../routers/venfor_info_controller'));

// ~ Router for customer info controller
app.use('/customers', require('../routers/customer_info_controller'));

// ~ Router for shop controller
app.use('/shops', require('../routers/shop_controller'));

// ~ Router for selling category controller
app.use('/categories', require('../routers/selling_category_controller'));

// ~ Router for product controller
app.use('/products', require('../routers/product_controller'));

// ~ Router for wishlist controller
app.use('/wishlists', require('../routers/wishlist_controller'));

// ~ Router for cart controller
app.use('/carts', require('../routers/cart_controller'));

// ~ Router for customer order controller
app.use('/customer-orders', require('../routers/customer_order_controller'));

// ~ Router for order item controller
app.use('/order-items', require('../routers/order_item_controller'));

// ~ Router for promo controller
app.use('/promos', require('../routers/promo_controller'));

// ~ Router for custom order controller
app.use('/custom-orders', require('../routers/custom_order_controller'));

// ~ Router for email controller
app.use('/emails', require('../routers/email_controller'));

// ~ Router for refund controller
app.use('/refunds', require('../routers/refund_controller'));

// ~ Router for review controller
app.use('/reviews', require('../routers/review_controller'));

// ~ Router for refund settings controller
app.use('/refund-settings', require('../routers/refund_settings_controller'));

// ~ Router for dispute controller
app.use('/disputes', require('../routers/dispute_controller'));

// ~ Router for support ticket controller
app.use('/support-tickets', require('../routers/support_ticket_controller'));

// ~ Router for dashboard controller
app.use('/dashboards', require('../routers/dashboard_controller'));

// ~ Router for child category controller
app.use('/child-categories', require('../routers/child_category_controller'));

// ~ Router for brand controller
app.use('/brands', require('../routers/brand_controller'));

// ~ Router for address controller
app.use('/addresses', require('../routers/address_controller'));

// ~ Router for general data controller
app.use('/general-data', require('../routers/general_data_controller'));

// ~ Router for top bar data controller
app.use('/top-bar-data', require('../routers/top_bar_data_controller'));

// ~ Router for footer data controller
app.use('/footer-data', require('../routers/footer_data_controller'));

// ~ Router for footer data controller
app.use('/social-links', require('../routers/social_link_controller'));

// ~ Router for shipping and vat controller
app.use('/shipping-vats', require('../routers/shipping_and_vat_controller'));

// ~ Router for motivation box controller
app.use('/motivation-box-data', require('../routers/motivation_box_data_controller'));

// ~ Router for home offer image controller
app.use('/home-offer-images', require('../routers/home_offer_image_controller'));

// ~ Router for vendor home data controller
app.use('/vendor-home-data', require('../routers/vendor_home_data_controller'));

// ~ Router for offer slider data controller
app.use('/offer-slider-data', require('../routers/offer_slider_data_controller'));

// ~ Router for favourite shop controller
app.use('/favourite-shops', require('../routers/favourite_shop_controller'));

// ~ Router for platform fee controller
app.use('/platform-fees', require('../routers/platform_fee_controller'));

module.exports = app;