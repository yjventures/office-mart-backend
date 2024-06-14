const FooterData = require("../db/footer_data");
const { userType } = require("../utils/enums");

// * Function to create footer data
const createFooterData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const footerDataObject = {};
      for (let item in req?.body) {
        if (item === "second_column" || item === "third_column" || item === "fourth_column") {

          if(req?.body[item]?.heading_name) {
            footerDataObject[item] = {
              ...footerDataObject[item],
              heading_name: req.body[item].heading_name
            }
          }
          if (req?.body[item]?.items) {
            footerDataObject[item] = {
              ...footerDataObject[item],
              items: req.body[item].items
            }
          }
        } else {
          footerDataObject[item] = req.body[item];
        }
      }
      const footerDataCollection = await new FooterData(footerDataObject);
      const footerData = await footerDataCollection.save();
      if (footerData) {
        res.status(200).json({ footer_data: footerData });
      } else {
        res.status(404).json({ message: "Top Bar data not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get footer data using querystring
const getFooterData = async (req, res) => {
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
    const allFooterData = await FooterData.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await FooterData.countDocuments(query);
    if (allFooterData) {
      res.status(200).json({ footer_data: allFooterData, total: count });
    } else {
      res.status(404).json({ message: "Footer data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get footer data using ID
const getFooterDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const footer_data = await FooterData.findById(id);
    if (footer_data) {
      res.status(200).json({ footer_data });
    } else {
      res.status(404).json({ message: "Footer data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update footer data using ID
const updateFooterDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const footer_data = await FooterData.findById(id).lean();
      for (let item in req?.body) {
        if (item === "second_column" || item === "third_column" || item === "fourth_column") {
          if(req?.body[item]?.heading_name) {
            footer_data[item].heading_name = req.body[item].heading_name
          }
          if (req?.body[item]?.items) {
            footer_data[item].items = req.body[item].items
          }
        } else {
          footer_data[item] = req.body[item];
        }
      }
      const footerData = await FooterData.findByIdAndUpdate(
        id,
        footer_data,
        {
          new: true,
        }
      );
      if (footerData) {
        res.status(200).json({ footer_data: footerData });
      } else {
        res.status(404).json({ message: "Footer data not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete footer data using ID
const deleteFooterDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const footer_data = await FooterData.findById(id);
      if (footer_data) {
        await FooterData.findByIdAndDelete(id);
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
  createFooterData,
  getFooterData,
  getFooterDataByID,
  updateFooterDataByID,
  deleteFooterDataByID,
};