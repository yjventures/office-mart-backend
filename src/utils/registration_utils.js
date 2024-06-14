const crypto = require("crypto");

const generateVerificationLink = (userId) => {
    try {
      let secretKey = process.env.CRYPTO_SECRET;
      const cipher = crypto.createCipher('aes-256-cbc', secretKey);
      let encryptedUserId = cipher.update(userId.toString(), 'utf-8', 'hex');
      encryptedUserId += cipher.final('hex');
      
      const confirmationLink = `${process.env.REGISTER_REDIRECT_URL}/authenticate/${encodeURIComponent(encryptedUserId)}`;
      return confirmationLink;
    } catch (err) {
      throw new Error({ message: 'Error generate verification link' });
    }
};

module.exports = {
  generateVerificationLink,
}