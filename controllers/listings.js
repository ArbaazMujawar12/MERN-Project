const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn} = require("../middleware");
const {isOwner} = require("../middleware");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.new = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.create = async (req, res) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing is added !");
    res.redirect("/listings");
};

module.exports.showAll = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews",
        populate : {
            path : "author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing Does not exist !");
        res.redirect("/listings");
    }
    console.log(listing);
    
    res.render("./listings/show.ejs", { listing });
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Does not exist !");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
};

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is deleted !");
    res.redirect("/listings");
};