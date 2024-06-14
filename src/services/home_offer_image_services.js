const HomeOfferImage = require('../db/home_offer_image');
const { userType } = require("../utils/enums");

// * Function to create home offer image
const createHomeOfferImage = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const homeOfferImageObject = {};
      for (let item in req?.body) {
        homeOfferImageObject[item] = req.body[item];
      }
      const homeOfferImageCollection = await new HomeOfferImage(homeOfferImageObject);
      const homeOfferImage = await homeOfferImageCollection.save();
      if (homeOfferImage) {
        res.status(200).json({ home_offer_image: homeOfferImage });
      } else {
        res.status(404).json({ message: "Home offer image not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get home offer image using querystring
const getHomeOfferImage = async (req, res) => {
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
    const allHomeOfferImage = await HomeOfferImage.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await HomeOfferImage.countDocuments(query);
    if (allHomeOfferImage) {
      res.status(200).json({ home_offer_images: allHomeOfferImage, total: count });
    } else {
      res.status(404).json({ message: "Home offer image not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get home offer image using ID
const getHomeOfferImageByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const home_offer_image = await HomeOfferImage.findById(id);
    if (home_offer_image) {
      res.status(200).json({ home_offer_image });
    } else {
      res.status(404).json({ message: "Home offer image not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update home offer image using ID
const updateHomeOfferImageByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const home_offer_image = await HomeOfferImage.findById(id).lean();
      for (let item in req?.body) {
        home_offer_image[item] = req.body[item];
      }
      const homeOfferImage = await HomeOfferImage.findByIdAndUpdate(
        id,
        home_offer_image,
        {
          new: true,
        }
      );
      if (homeOfferImage) {
        res.status(200).json({ home_offer_image: homeOfferImage });
      } else {
        res.status(404).json({ message: "Home offer image not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete home offer image using ID
const deleteHomeOfferImageByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const home_offer_image = await HomeOfferImage.findById(id);
      if (home_offer_image) {
        await HomeOfferImage.findByIdAndDelete(id);
        res
          .status(200)
          .json({ message: "Home offer image deleted successfully" });
      } else {
        res.status(404).json({ message: "Home offer image not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createHomeOfferImage,
  getHomeOfferImage,
  getHomeOfferImageByID,
  updateHomeOfferImageByID,
  deleteHomeOfferImageByID,
};