const GeneralData = require("../db/general_data");
const { userType } = require("../utils/enums");

// * Function to create general data
const createGeneralData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const generalDataObject = {};
      for (let item in req?.body) {
        generalDataObject[item] = req.body[item];
      }
      const generalDataCollection = await new GeneralData(generalDataObject);
      const generalData = await generalDataCollection.save();
      if (generalData) {
        res.status(200).json({ generalData });
      } else {
        res.status(404).json({ message: "General data not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get general data using querystring
const getGeneralData = async (req, res) => {
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
    const allGeneralData = await GeneralData.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await GeneralData.countDocuments(query);
    if (allGeneralData) {
      res.status(200).json({ general_data: allGeneralData, total: count });
    } else {
      res.status(404).json({ message: "General data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get general data using ID
const getGeneralDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const general_data = await GeneralData.findById(id);
    if (general_data) {
      res.status(200).json({ general_data });
    } else {
      res.status(404).json({ message: "General data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update general data using ID
const updateGeneralDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const general_data = await GeneralData.findById(id).lean();
      for (let item in req?.body) {
        if (item === "event") {
          for (let el in req?.body?.event) {
            general_data.event[el] = req?.body?.event[el];
          }
        } else {
          general_data[item] = req?.body[item];
        }
      }
      const generalData = await GeneralData.findByIdAndUpdate(
        id,
        general_data,
        {
          new: true,
        }
      );
      if (generalData) {
        res.status(200).json({ general_data: generalData });
      } else {
        res.status(404).json({ message: "General data not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete general data using ID
const deleteGeneralDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const general_data = await GeneralData.findById(id);
      if (general_data) {
        await GeneralData.findByIdAndDelete(id);
        res.status(200).json({ message: "General data deleted successfully" });
      } else {
        res.status(404).json({ message: "General data not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createGeneralData,
  getGeneralData,
  getGeneralDataByID,
  updateGeneralDataByID,
  deleteGeneralDataByID,
};
