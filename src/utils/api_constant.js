const authAPI = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  VERIFY: '/verify',
};

const userAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/user/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  FORGET_PASSWORD: '/forget-password', 
  RESET_PASSWORD: '/reset-password',
  VERIFY: '/verify-otp',
};

const shopAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/shop/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  GET_USER: '/get-user',
};

const categoryAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/category/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  GET_BY_PARENT: '/parent/:id',
};

const productAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/product/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  SEARCH_BY_FILTERS: '/filter',
  BULK_UPLOAD: '/bulk-upload/:id',
  DELETE_VARIATIONS: '/delete-variations/:id',
  ADD_VARIATIONS: '/add-variations/:id',
  GET_TOP_PRODUCTS: '/get-top-products',
};

const wishlistAPI = {
  GET_BY_ID: '/wishlist/:id',
  ADD_PRODUCT: '/add-product/:id',
  DELETE_PRODUCT: '/delete-product/:id',
  CLEAR_WISHLIST: '/clear-wishlist/:id',
};

const cartAPI = {
  GET_BY_ID: '/cart/:id',
  GET_BY_TOKEN: '/get-by-token/:id',
  ADD_PRODUCT: '/add-product/:id',
  ADD_PRODUCT_BY_TOKEN: '/add-product-token/:id',
  DELETE_PRODUCT: '/delete-product/:id',
  DELETE_PRODUCT_BY_TOKEN: '/delete-product-token/:id',
  UPDATE_PRODUCT: '/update-product/:id',
  UPDATE_PRODUCT_BY_TOKEN: '/update-product-token/:id',
  CLEAR_CART: '/clear-cart/:id',
  CLEAR_CART_BY_TOKEN: '/clear-cart-token/:id',
};

const customerOrderAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/order/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  GET_INFOS: '/get-infos',
};

const orderItemAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/order-item/:id',
  UPDATE_BY_ID: '/update/:id',
  CANCEL_BATCH: '/cancel-batch',
};

const promoAPI = {
  CREATE: '/create',
  APPLY: '/apply',
};

const customOrderAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/custom-order/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const emailAPI = {
  SEND_TEXT: '/send-text',
  SEND_FILE_AND_TEXT: '/send-file-text',
  SEND_MULTIPLE_EMAIL: '/send-multiple-email',
};

const refundAPI = {
  CREATE: '/create',
  CREATE_BATCH: '/create-batch',
  GET_ALL: '/get-all',
  GET_BY_ID: '/refund/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const reviewAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/review/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  SET_FLAG_BY_ID: '/set-flag/:id',
};

const refundSettingAPI = {
  CREATE: '/create',
  UPDATE_BY_ID: '/update/:id',
  GET_BY_ID: '/refund-setting/:id',
};

const disputeAPI = {
  CREATE: '/create',
  CREATE_BATCH: '/create-batch',
  GET_ALL: '/get-all',
  GET_BY_ID: '/dispute/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  DISPUTE_BY_ID: '/dispute-product/:id',
};

const supportTicketAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/support-ticket/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const dashboardAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/dashboard/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
  PROVIDE_DATA: '/provide-data',
  ANALYTICS: '/analytics',
  ADD_VISITOR: '/add-visitor',
};

const brandAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/brand/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const addressAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/address/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const generalDataAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const topBarDataAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const footerDataAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const socialLinkAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const shippingAndVatAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const motivationBoxDataAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const homeOfferImageAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const VendorHomeDataAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const offerSliderDataAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/data/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

const favouriteShopAPI = {
  CREATE: '/create',
  GET_BY_ID: '/get-list/:id',
};

const platformFeeAPI = {
  CREATE: '/create',
  GET_ALL: '/get-all',
  GET_BY_ID: '/platform-fee/:id',
  UPDATE_BY_ID: '/update/:id',
  DELETE_BY_ID: '/delete/:id',
};

module.exports = {
  authAPI,
  userAPI,
  shopAPI,
  categoryAPI,
  productAPI,
  wishlistAPI,
  cartAPI,
  customerOrderAPI,
  orderItemAPI,
  promoAPI,
  customOrderAPI,
  emailAPI,
  refundAPI,
  reviewAPI,
  refundSettingAPI,
  disputeAPI,
  supportTicketAPI,
  dashboardAPI,
  brandAPI,
  addressAPI,
  generalDataAPI,
  topBarDataAPI,
  footerDataAPI,
  socialLinkAPI,
  shippingAndVatAPI,
  motivationBoxDataAPI,
  homeOfferImageAPI,
  VendorHomeDataAPI,
  offerSliderDataAPI,
  favouriteShopAPI,
  platformFeeAPI,
};

