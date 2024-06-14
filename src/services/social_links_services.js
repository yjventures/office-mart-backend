const SocialLink = require('../db/social_links');
const { userType } = require("../utils/enums");

// * Function to create social link data
const createSocialLinkData = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const socialLinkObject = {};
      for (let item in req?.body) {
        socialLinkObject[item] = req.body[item];
      }
      const socialLinkCollection = await new SocialLink(socialLinkObject);
      const socialLink = await socialLinkCollection.save();
      if (socialLink) {
        res.status(200).json({ social_link: socialLink });
      } else {
        res.status(404).json({ message: "Social link not created" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get social link data using querystring
const getSocialLinkData = async (req, res) => {
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
    const allSocialLink = await SocialLink.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await SocialLink.countDocuments(query);
    if (allSocialLink) {
      res.status(200).json({ social_links: allSocialLink, total: count });
    } else {
      res.status(404).json({ message: "Social link not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get social link data using ID
const getSocialLinkDataByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const social_link = await SocialLink.findById(id);
    if (social_link) {
      res.status(200).json({ social_link });
    } else {
      res.status(404).json({ message: "Social link not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update social link data using ID
const updateSocialLinkDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const social_link = await SocialLink.findById(id).lean();
      for (let item in req?.body) {
        social_link[item] = req.body[item];
      }
      const socialLink = await SocialLink.findByIdAndUpdate(
        id,
        social_link,
        {
          new: true,
        }
      );
      if (socialLink) {
        res.status(200).json({ social_link: socialLink });
      } else {
        res.status(404).json({ message: "Social link not updated" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete social link data using ID
const deleteSocialLinkDataByID = async (req, res) => {
  try {
    if (
      req.user.type !== userType.ADMIN &&
      req.user.type !== userType.SUPER_ADMIN
    ) {
      res.status(400).json({ message: "You must be an admin" });
    } else {
      const id = req?.params?.id;
      const social_link = await SocialLink.findById(id);
      if (social_link) {
        await SocialLink.findByIdAndDelete(id);
        res.status(200).json({ message: "Social Link deleted successfully" });
      } else {
        res.status(404).json({ message: "Social Link data not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createSocialLinkData,
  getSocialLinkData,
  getSocialLinkDataByID,
  updateSocialLinkDataByID,
  deleteSocialLinkDataByID,
};