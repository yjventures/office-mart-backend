const OfferSliderData = require('../db/offer_slider_data');
const { userType } = require("../utils/enums");

// * Function to create offer slider data
const createOfferSliderData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const offerSliderDataObject = {};
      for (let item in req?.body) {
        offerSliderDataObject[item] = req.body[item];
      }
      const offerSliderDataCollection = await new OfferSliderData(offerSliderDataObject);
      const offerSliderData = await offerSliderDataCollection.save();
      if (offerSliderData) {
        res.status(200).json({ offer_slider_data: offerSliderData });
      } else {
        res.status(404).json({ message: "Offer slider data not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get offer slider data using querystring
const getOfferSliderData = async (req, res) => {
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
    const allOfferSliderData = await OfferSliderData.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await OfferSliderData.countDocuments(query);
    if (allOfferSliderData) {
      res.status(200).json({ offer_slider_data: allOfferSliderData, total: count });
    } else {
      res.status(404).json({ message: "Offer slider data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get offer slider data using ID
const getOfferSliderDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const offer_slider_data = await OfferSliderData.findById(id);
    if (offer_slider_data) {
      res.status(200).json({ offer_slider_data });
    } else {
      res.status(404).json({ message: "Offer slider data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update offer slider data using ID
const updateOfferSliderDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const offer_slider_data = await OfferSliderData.findById(id).lean();
      for (let item in req?.body) {
        offer_slider_data[item] = req.body[item];
      }
      const offerSliderData = await OfferSliderData.findByIdAndUpdate(
        id,
        offer_slider_data,
        {
          new: true,
        }
      );
      if (offerSliderData) {
        res.status(200).json({ offer_slider_data: offerSliderData });
      } else {
        res.status(404).json({ message: "Offer slider data not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete offer slider data using ID
const deleteOfferSliderDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const offer_slider_data = await OfferSliderData.findById(id);
      if (offer_slider_data) {
        await OfferSliderData.findByIdAndDelete(id);
        res
          .status(200)
          .json({ message: "Offer slider data deleted successfully" });
      } else {
        res.status(404).json({ message: "Offer slider data not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createOfferSliderData,
  getOfferSliderData,
  getOfferSliderDataByID,
  updateOfferSliderDataByID,
  deleteOfferSliderDataByID,
};