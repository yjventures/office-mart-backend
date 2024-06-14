const MotivationBoxData = require('../db/motivation_box_data');
const { userType } = require("../utils/enums");

// * Function to create motivation box data
const createMotivationBoxData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const motivationBoxDataObject = {};
      for (let item in req?.body) {
        motivationBoxDataObject[item] = req.body[item];
      }
      const motivationBoxDataCollection = await new MotivationBoxData(motivationBoxDataObject);
      const motivationBoxData = await motivationBoxDataCollection.save();
      if (motivationBoxData) {
        res.status(200).json({ motivation_box_data: motivationBoxData });
      } else {
        res.status(404).json({ message: "Motivation box data not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get motivation box data using querystring
const getMotivationBoxData = async (req, res) => {
  try {
    const query = {};
    let limit = 10,
      page = 1;
    let sortBy = "createdAt";
    for (let item in req?.query) {
      if (item === "page" || item === "limit") {
        const number = Number(req.query[item]);
        if (!isNaN(number)) {
          if (item === "page") {
            page = number;
          } else {
            limit = number;
          }
        }
      } else if (item === "sortBy") {
        sortBy = req?.query[item];
      } else {
        query[item] = req.query[item];
      }
    }
    const allMotivationBoxData = await MotivationBoxData.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await MotivationBoxData.countDocuments(query);
    if (allMotivationBoxData) {
      res.status(200).json({ motivation_box_data: allMotivationBoxData, total: count });
    } else {
      res.status(404).json({ message: "Motivation box data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get motivation box data using ID
const getMotivationBoxDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const motivation_box_data = await MotivationBoxData.findById(id);
    if (motivation_box_data) {
      res.status(200).json({ motivation_box_data });
    } else {
      res.status(404).json({ message: "Motivation box data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update motivation box data using ID
const updateMotivationBoxDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const motivation_box_data = await MotivationBoxData.findById(id).lean();
      for (let item in req?.body) {
        for (let el in req?.body[item]) {
          motivation_box_data[item][el] = req.body[item][el];
        }
      }
      const motivationBoxData = await MotivationBoxData.findByIdAndUpdate(
        id,
        motivation_box_data,
        {
          new: true,
        }
      );
      if (motivationBoxData) {
        res.status(200).json({ motivation_box_data: motivationBoxData });
      } else {
        res.status(404).json({ message: "Motivation box data not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete motivation box data using ID
const deleteMotivationBoxDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const motivation_box_data = await MotivationBoxData.findById(id);
      if (motivation_box_data) {
        await MotivationBoxData.findByIdAndDelete(id);
        res
          .status(200)
          .json({ message: "Motivation box data deleted successfully" });
      } else {
        res.status(404).json({ message: "Motivation box data not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createMotivationBoxData,
  getMotivationBoxData,
  getMotivationBoxDataByID,
  updateMotivationBoxDataByID,
  deleteMotivationBoxDataByID,
};