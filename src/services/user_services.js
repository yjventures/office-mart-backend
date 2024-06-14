const { validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
require("dotenv").config();
const User = require("../db/user");
const Otp = require("../db/otp");
const { hashPassword } = require("../common/manage_pass");
const { generateVerificationLink } = require("../utils/registration_utils");
const { SendEmailUtils } = require("../utils/send_email_utils");
const { otpStatus } = require("../utils/enums");
const { addMinutes, isLessThan } = require("../common/manage_dates");
const { deleteCustomer } = require("./customer_info_services");
const { deleteVendor } = require("./vendor_info_services");
const { userType } = require("../utils/enums");

// * Function to create an user
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      if (req?.body?.email) {
        const exist = await User.findOne({ email: req.body.email });
        if (exist) {
          return res.status(400).json({ message: "Email already exists" });
        }
      } else {
        return res.status(400).json({ message: "Email not found" });
      }
      const password = await hashPassword(req?.body?.password);
      const userObj = {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        password,
        phone: req?.body?.phone,
        birthdate: req?.body?.birthdate,
        address: req?.body?.address,
      };
      if (req?.body?.type) {
        userObj.type = req?.body?.type;
      }
      const user = await new User(userObj);
      const newUser = await user.save();

      const verificationLink = generateVerificationLink(newUser._id);

      const emailText = 
      `Hi there!

      Welcome to ${process.env.NAME}. You've just signed up for a new account.
      Please click the link below to verify your email:

      ${verificationLink}
      
      Regards,
      The ${process.env.NAME} Team`;
      const emailSubject = `Verify your account at ${process.env.NAME}`;
      const emailStatus = await SendEmailUtils(
        newUser?.email,
        emailText,
        emailSubject
      );

      const emailSent = emailStatus.accepted.find((item) => {
        return item === newUser.email;
      });

      if (newUser && emailSent) {
        res
          .status(200)
          .json({ message: "User created successfully", user: newUser });
      } else {
        if (!newUser) {
          res.status(503).json({ message: "User cannot be created" });
        } else {
          const deleteUser = User.findByIdAndDelete(newUser._id);
          res.status(503).json({ message: "Email could not be sent" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to find user by id
const getUserByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
};

// * Function to update user by ID
const updateUserByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const query = {};
      for (let item in req?.body) {
        if (item == "birthdate") {
          const bday = req?.body?.birthdate.split("/").reverse().join("-");
          query.birthdate = new Date(bday);
        } else {
          query[item] = req.body[item];
        }
      }
      const updateUser = await User.findByIdAndUpdate(id, query, {
        new: true,
      });
      if (!updateUser) {
        res.status(400).json({ message: "Somthing wrong with the update" });
      } else {
        res.status(200).json({ user: updateUser });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
};

// * Function to delete user by ID
const deleteUserByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN &&
      req.user.type !== userType.VENDOR
    ) {
      res.status(400).json({
        message: "You have to be admin or super admin to delete this account",
      });
    } else {
      const deleteUser = await User.findByIdAndDelete(id);
      if (!deleteUser) {
        res.status(404).json({ message: "User not found" });
      } else {
        if (deleteUser.customer_info) {
          await deleteCustomer(deleteUser.customer_info);
        }
        if (deleteUser.vendor_info) {
          await deleteVendor(deleteUser.vendor_info);
        }
        // if (deleteUser.admin_info) {
        //   await deleteAdminInfoByID(deleteUser.admin_info);
        // }
        res.status(200).json({ message: "User is deleted" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
};

// * Function to get all the users (can have querystring)
const getAllUser = async (req, res) => {
  try {
    const query = {};
    let page = 1,
      limit = 10;
    let sortBy = "createdAt";
    for (let item in req?.query) {
      if (item === "page") {
        page = Number(req?.query?.page);
        if (isNaN(page)) {
          page = 1;
        }
      } else if (item === "limit") {
        limit = Number(req?.query?.limit);
        if (isNaN(limit)) {
          limit = 10;
        }
      } else if (item === "sortBy") {
        sortBy = req?.query?.sortBy;
      } else {
        query[item] = req?.query[item];
      }
    }
    const users = await User.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await User.countDocuments(query);
    res.status(200).json({ users, total: count });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
};

// * Functions to recover forget password
const forgetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const email = req?.body?.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({ message: "User with this email not found" });
      } else {
        const previousOtp = await Otp.find({ email, status: otpStatus.UNUSED });
        if (previousOtp.length > 0) {
          previousOtp.forEach((item) => {
            item.status = otpStatus.CANCELED;
          });
        }
        const verificationCode = otpGenerator.generate(4, {
          digits: true,
          alphabets: false,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        const otp = await new Otp({ email, otp: verificationCode });
        await otp.save();
        const emailText = `Your password reset varification code is ${verificationCode} .`;
        const emailSubject = `Verification code for reset password in ${process.env.NAME}`;
        const emailStatus = await SendEmailUtils(
          email,
          emailText,
          emailSubject
        );
        const emailSent = emailStatus.accepted.find((item) => {
          return item === email;
        });
        if (emailSent) {
          res
            .status(200)
            .json({ message: "Verification code sent successfully" });
        } else {
          await Otp.findOneAndDelete({
            email,
            otp: verificationCode,
            status: otpStatus.UNUSED,
          });
          res.status(503).json({ message: "Email could not be sent" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
};

// * Function to verify otp
const verifyOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const email = req?.body?.email;
      const code = req?.body?.code;
      const otp = await Otp.findOne({ email: email, otp: code });

      if (
        !otp ||
        otp.status !== otpStatus.UNUSED
        // isLessThan(
        //   addMinutes(otp.createdDate, Number(process.env.OTP_EXPIRATION_TIME)),
        //   Date.now()
        // )
      ) {
        await Otp.findByIdAndUpdate(
          otp._id,
          { status: otpStatus.CANCELED },
          { new: true }
        );
        res.status(400).json({ message: "Invalid verification code" });
      } else {
        const user = await User.findOne({ email });
        await Otp.findByIdAndUpdate(
          otp._id,
          { status: otpStatus.USED },
          { new: true }
        );
        res.status(200).json({ userId: user._id });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
};

// * Function to reset password
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const password = await hashPassword(req?.body?.password);
      const userId = req?.body?.userId;
      const user = await User.findByIdAndUpdate(
        userId,
        { password },
        {
          new: true,
        }
      );
      if (!user) {
        res.status(400).json({ message: "Password could not be updated." });
      } else {
        res.status(200).json({ user });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
  forgetPassword,
  verifyOtp,
  resetPassword,
};
