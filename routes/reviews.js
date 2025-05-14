const express = require("express");
const router = express.Router({ mergeParams: true }); // Needed to access `:id` from parent route
const Listing = require("../models/listing");
const Review = require("../models/review");
const {isLoggedIn} = require("../middleware");
const {isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/reviews");

// Review creation route
router.post("/", isLoggedIn, (reviewController.createReview));

// Review deletion route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, (reviewController.destroyReview));

module.exports = router;
