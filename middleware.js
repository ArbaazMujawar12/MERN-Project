const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","Please Login to add new listing !");
        return res.render("./users/login.ejs");
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id); // Use findById for checking permissions before update
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // Or handle the case where the listing doesn't exist
        }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the List !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(res.locals.currUser._id)) { // Assuming you're using Passport.js and user info is in req.user
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};