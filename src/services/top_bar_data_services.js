const TopBarData = require("../db/top_bar_data");
const { userType } = require("../utils/enums");

// * Function to create top bar data
const createTopBarData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const topBarDataObject = {};
      for (let item in req?.body) {
        topBarDataObject[item] = req.body[item];
      }
      const topBarDataCollection = await new TopBarData(topBarDataObject);
      const topBarData = await topBarDataCollection.save();
      if (topBarData) {
        res.status(200).json({ top_bar_data: topBarData });
      } else {
        res.status(404).json({ message: "Top Bar data not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get top bar data using querystring
const getTopBarData = async (req, res) => {
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
      } else if (item === "tags") {
        query.tags = { $in: req.query[item] };
      } else {
        query[item] = req.query[item];
      }
    }
    const allTopBarData = await TopBarData.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await TopBarData.countDocuments(query);
    if (allTopBarData) {
      res.status(200).json({ top_bar_data: allTopBarData, total: count });
    } else {
      res.status(404).json({ message: "Top bar data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get top bar data using ID
const getTopBarDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const top_bar_data = await TopBarData.findById(id);
    if (top_bar_data) {
      res.status(200).json({ top_bar_data });
    } else {
      res.status(404).json({ message: "Top bar data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update top bar data using ID
const updateTopBarDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const top_bar_data = await TopBarData.findById(id).lean();
      for (let item in req?.body) {
        top_bar_data[item] = req?.body[item];
      }
      const topBarData = await TopBarData.findByIdAndUpdate(
        id,
        top_bar_data,
        {
          new: true,
        }
      );
      if (topBarData) {
        res.status(200).json({ top_bar_data: topBarData });
      } else {
        res.status(404).json({ message: "Top bar data not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete top bar data using ID
const deleteTopBarDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const top_bar_data = await TopBarData.findById(id);
      if (top_bar_data) {
        await TopBarData.findByIdAndDelete(id);
        res.status(200).json({ message: "Top bar data deleted successfully" });
      } else {
        res.status(404).json({ message: "Top bar data not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createTopBarData,
  getTopBarData,
  getTopBarDataByID,
  updateTopBarDataByID,
  deleteTopBarDataByID,
};