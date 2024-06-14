const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Review = require("../db/review");
const User = require("../db/user");
const ProductItem = require("../db/product_item");
const { userType } = require("../utils/enums");
const { updateProduct } = require("../services/product_service");

// * Function to create a review
const createReview = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await session.commitTransaction();
      session.endSession();
      res.status(400).json({ message: errors });
    } else {
      const reviewObj = {};
      for (let item in req?.body) {
        reviewObj[item] = req.body[item];
      }
      const reviewCollection = await new Review(reviewObj);
      const review = await reviewCollection.save({ session });
      const updateProductItem = await ProductItem.findByIdAndUpdate(
        req?.body?.product_item_id,
        { reviewed: true, review_id: review._id },
        { new: true, session }
      );
      const rateArr = await Review.aggregate([
        {
          $match: { product_id: updateProductItem?.product_id?._id }
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' }
          }
        }
      ]).session(session);
      let rate = 0;
      if (rateArr.length > 0) {
        rate = rateArr[0].avgRating;
      }
      const updatedProduct = await updateProduct(
        { rate },
        updateProductItem?.product_id?._id,
        session
      );
      await session.commitTransaction();
      session.endSession();
      if (review) {
        res.status(200).json({ review });
      } else {
        res.status(404).json({ message: "Review can't be created." });
      }
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get all review using querystring
const getAllReviews = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const query = {};
      let limit = 10;
      let page = 1;
      let sortBy = "createdAt";
      for (let item in req?.query) {
        if (item === "page" || item === "limit") {
          const num = Number(req?.query[item]);
          if (!isNaN(num)) {
            if (item === "page") {
              page = num;
            } else {
              limit = num;
            }
          }
        } else if (item === "sortBy") {
          sortBy = req?.query[item];
        } else {
          query[item] = req.query[item];
        }
      }
      const reviews = await Review.find(query)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit);
      if (reviews) {
        const allReviews = await Review.find(query);
        const total = allReviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const avg_rating = total / Math.max(reviews.length, 1);
        res.status(200).json({ avg_rating, reviews });
      } else {
        res.status(404).json({ message: "Reviews not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to get a review by ID
const getReviewByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params?.id;
      const review = await Review.findById(id);
      if (review) {
        res.status(200).json({ review });
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to update a rating by ID
const updateReviewByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params?.id;
      const review = await Review.findById(id).lean();
      if (review) {
        const customer = await User.findById(review.customer);
        if (
          (req.user.email === customer.email &&
            req.user.type === customer.type) ||
          req.user.type === userType.ADMIN ||
          req.user.type === userType.SUPER_ADMIN
        ) {
          for (let item in req?.body) {
            review[item] = req.body[item];
          }
          const updatedReview = await Review.findByIdAndUpdate(id, review, {
            new: true,
          });
          if (updatedReview) {
            res.status(200).json({ review: updatedReview });
          } else {
            res.status(400).json({ message: "Review not updated" });
          }
        } else {
          res.status(400).json({ message: "You can't update this review" });
        }
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to delete a rating by ID
const deleteReviewByID = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors });
    } else {
      const id = req?.params?.id;
      const review = await Review.findById(id).lean();
      if (review) {
        const customer = await User.findById(review.customer);
        if (
          (req.user.email === customer.email &&
            req.user.type === customer.type) ||
          req.user.type === userType.ADMIN ||
          req.user.type === userType.SUPER_ADMIN
        ) {
          const deleted = await Review.findByIdAndDelete(id);
          if (deleted) {
            res.status(200).json({ message: "Review deleted successfully" });
          } else {
            res.status(404).json({ message: "Review not found" });
          }
        } else {
          res.status(400).json({ message: "You can't delete this review" });
        }
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// * Function to set flag value
const setFlagByID = async (req, res) => {
  try {
    const id = req?.params?.id;
    const review = await Review.findById(id).lean();
    if (review) {
      review.flag = req?.body?.flag;
      const updatedReview = await Review.findByIdAndUpdate(id, review, {
        new: true,
      });
      if (updatedReview) {
        res.status(200).json({ review: updatedReview });
      } else {
        res.status(400).json({ message: "Review not updated" });
      }
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewByID,
  updateReviewByID,
  deleteReviewByID,
  setFlagByID,
};
