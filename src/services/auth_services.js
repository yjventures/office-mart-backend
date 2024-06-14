const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../db/user");
const Notification = require("../db/push_notification");
const { checkHash } = require("../common/manage_pass");
const { loginType } = require("../utils/enums");
const {
  sendPushNotification,
  sendMultiplePushNotification,
} = require("../utils/push_notification_utils");
// * Generate Access token and Refresh token
const generateTokens = (user) => {
  try {
    const tokenForAccess = jwt.sign(
      { email: user.email, id: user._id, type: user.type },
      process.env.JWT_SECRET,
      {
        expiresIn: "10h",
      }
    );
    const tokenForRefresh = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "6d",
    });
    const userJsonObj = user.toJSON();
    userJsonObj.accessToken = tokenForAccess;
    userJsonObj.refreshToken = tokenForRefresh;
    return userJsonObj;
  } catch (err) {
    throw err;
  }
};

// * Handle Email Login function
const handleEmailLogin = async (email, password, userType, fcm_token, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOne({ email, type: userType });
    if (user) {
      const isValidPassword = await checkHash(password, user.password);
      if (isValidPassword) {
        const userJsonObj = generateTokens(user);
        if (fcm_token) {
          const savedToken = await Notification.findOne({
            user_id: user._id,
            fcm_token,
          });
          if (!savedToken) {
            const notification = await new Notification({
              user_id: user._id,
              fcm_token,
            });
            await notification.save();
          }
        }
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ data: { user: userJsonObj } });
      } else {
        await session.commitTransaction();
        session.endSession();
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      await session.commitTransaction();
      session.endSession();
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// * Handle Refresh Token function
const handleRefreshTokenLogin = (refreshToken, res) => {
  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      res.status(401).json({ message: "Unauthorised refresh token" });
    } else {
      const { id } = payload;
      const user = await User.findById(id);
      if (!user) {
        res.status(401).json({ message: "Unauthorised user" });
      } else {
        const userJsonObj = generateTokens(user);
        res.status(200).json({ data: { user: userJsonObj } });
      }
    }
  });
};

// * Login function
const login = async (req, res) => {
  try {
    const email = req?.body?.email;
    const password = req?.body?.password;
    const type = req?.body?.type;
    const refreshToken = req?.body?.refreshToken;
    const fcm_token = req?.body?.fcm_token;
    const userType = req?.body?.userType ?? "customer";
    if (!type) {
      res.status(404).json({ message: "Login type not defined" });
    } else if (type === loginType.EMAIL) {
      await handleEmailLogin(email, password, userType, fcm_token, res);
    } else if (type === loginType.REFRESH) {
      if (!refreshToken) {
        res.status(401).json({ message: "Invalid refresh token" });
      } else {
        handleRefreshTokenLogin(refreshToken, res);
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// * Verification function
const verifyEmail = async (req, res) => {
  try {
    const secretKey = process.env.CRYPTO_SECRET;
    const encryptedUserId = req?.body?.token;
    const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
    let decryptedUserId = decipher.update(encryptedUserId, "hex", "utf-8");
    decryptedUserId += decipher.final("utf-8");

    const user = await User.findByIdAndUpdate(
      decryptedUserId,
      { is_verified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// * Push Multiple Device notification service
const sendMultipleNotification = async (req, res) => {
  try {
    const userId = req?.body?.userId;
    const message = req?.body?.message;
    const status = await sendMultiplePushNotification(userId, message);
    if (status) {
      res.status(200).json({ message: "Notofication send successfully" });
    } else {
      res.status(400).json({ message: "Notofication send failed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// * Push Single Device notification service
const sendNotification = async (req, res) => {
  try {
    const userId = req?.body?.userId;
    const fcm_token = req?.body?.fcm_token;
    const message = req?.body?.message;
    const status = await sendPushNotification(userId, message, fcm_token);
    if (status) {
      res.status(200).json({ message: "Notofication send successfully" });
    } else {
      res.status(400).json({ message: "Notofication send failed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// * Push Multiple User Multiple Device notification service
const sendMultipleUserNotifications = async (req, res) => {
  try {
    const users = req?.body?.users;
    const message = req?.body?.message;
    for (let user of users) {
      const status = await sendMultiplePushNotification(user, message);
      console.log(status);
    }
    res.status(200).json({ message: "Notofication send successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  verifyEmail,
  sendMultipleNotification,
  sendNotification,
  sendMultipleUserNotifications,
};
