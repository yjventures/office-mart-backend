const PlatformFee = require("../db/platform_fee");

// * Function to create a platform fee
const createPlatformFee = async (req, res) => {
  try {
    const platformfeeObj = {};
    for (let item in req?.body) {
      platformfeeObj[item] = req.body[item];
    }
    const platformFeeCollection = await new PlatformFee(platformfeeObj);
    const platformFee = await platformFeeCollection.save();
    if (!platformFee) {
      res.status(400).json({ message: "Couldn't create platform amount" });
    } else {
      res.status(200).json({ platform_amount: platformFee });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all platform fees using querystring
const getAllPlatformFees = async (req, res) => {
  try {
    const query = {};
    let page = 1;
    let limit = 100;
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
      } else {
        query[item] = req.query[item];
      }
    }
    const allPlatformfees = await PlatformFee.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await PlatformFee.countDocuments(query);
    if (allPlatformfees.length > 0) {
      res
        .status(200)
        .json({ all_platform_fees: allPlatformfees, total: count });
    } else {
      res.status(200).json({ all_platform_fees: [], total: 0 });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a platform fee by ID
const getPlatformFeeByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const platformfee = await PlatformFee.findById(id);
    if (!platformfee) {
      res.status(404).json({ message: "Platform amount not found" });
    } else {
      res.status(200).json({ platform_amount: platformfee });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a platform fee by ID
const updatePlatformFeeByID = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const platformFee = {};
      for (let item in req?.body) {
        platformFee[item] = req.body[item];
      }
      const updatePlatformFee = await PlatformFee.findByIdAndUpdate(
        id,
        platformFee,
        { new: true }
      );
      if (updatePlatformFee) {
        res.status(200).json({ platform_amount: updatePlatformFee });
      } else {
        res.status(400).json({ message: "Platform amount did not changed" });
      }
    } else {
      res.status(400).json({ message: "You have to provide a unique id" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete platform fee by ID
const deletePlatformFeeByID = async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const platformFee = await PlatformFee.findById(id).lean();
      if (platformFee) {
        await PlatformFee.findByIdAndDelete(id);
        res.status(200).json({ message: "Platform amount removed" });
      } else {
        res.status(404).json({ message: "platform fee not found" });
      }
    } else {
      res.status(400).json({ message: "You have to provide a unique id" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createPlatformFee,
  getAllPlatformFees,
  getPlatformFeeByID,
  updatePlatformFeeByID,
  deletePlatformFeeByID,
};
