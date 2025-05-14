const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn} = require("../middleware");
const {isOwner} = require("../middleware");
const listingController = require("../controllers/listings");


// ✅ Show all listings
router.get("/", (listingController.index));

// ✅ Route to show form for new listing (MUST come before "/:id")
router.get("/new", isLoggedIn,(listingController.new));

// ✅ Create a new listing
router.post("/", wrapAsync(listingController.create));

// ✅ Show one listing (populate reviews)
router.get("/:id", listingController.showAll);

// ✅ Edit listing form
router.get("/:id/edit", isLoggedIn , isOwner ,listingController.edit);

// ✅ Update listing
router.put("/:id",isLoggedIn ,isOwner ,listingController.update);

// ✅ Delete listing
router.delete("/:id", isLoggedIn,isOwner,listingController.destroy);

module.exports = router;
