const loginType = {
  REFRESH: 'refresh',
  EMAIL: 'email',
};

const userType = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
};

const otpStatus = {
  UNUSED: 0,
  USED: 1,
  CANCELED: 2,
}

module.exports = {
  loginType,
  userType,
  otpStatus,
};
