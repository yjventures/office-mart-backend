const { validationResult } = require("express-validator");
const RefundSetting = require("../db/refund_setting");
const { userType } = require("../utils/enums");

// * Function to create a refund setting
const createRefundSetting = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be admin" });
    } else {
      const refundSettingObj = {};
      for (let item in req?.body) {
        refundSettingObj[item] = req?.body[item];
      }
      const refundSettingCollection = await new RefundSetting(refundSettingObj);
      const refundSetting = await refundSettingCollection.save();
      if (refundSetting) {
        res.status(200).json({ refund_setting: refundSetting });
      } else {
        res.status(400).json({ message: "Refund cannot be created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to change a refund setting
const updateRefundSetting = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else if (
      req?.user?.type !== userType.ADMIN &&
      req?.user?.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You have to be admin" });
    } else {
      const id = req?.params?.id;
      const refundSetting = await RefundSetting.findById(id).lean();
      if (!refundSetting) {
        res.status(404).json({ message: "Refund not found" });
      } else {
        for (let item in req?.body) {
          refundSetting[item] = req?.body[item];
        }
        const updatedRefundSetting = await RefundSetting.findByIdAndUpdate(
          refundSetting._id,
          refundSetting,
          { new: true }
        );
        if (updatedRefundSetting) {
          res.status(200).json({ refund_setting: updatedRefundSetting });
        } else {
          res.status(404).json({ message: "Refund setting not found" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get the Refund Setting
const getRefundSetting = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params?.id;
      if (id) {
        const refund_setting = await RefundSetting.findById(id);
        if (refund_setting) {
          res.status(200).json({ refund_setting });
        } else {
          res.status(404).json({ message: "Refund setting not found" });
        }
      } else {
        res.status(400).json({ message: "Settings cannot find" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createRefundSetting,
  updateRefundSetting,
  getRefundSetting,
};
