require('dotenv').config();
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");
const flash = require("connect-flash");

const Listing = require("./models/listing");
const Review = require("./models/review");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/user");

const db_url = process.env.ATLAS_DB;

// Mongoose connection
main()
  .then(() => console.log("Database Connected!"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}

const store = MongoStore.create({
  mongoUrl : db_url,
  crypto :{
    secret : process.env.SECRET
  },
  touchAfter : 24 * 3600
});

app.get("/",(req,res)=>{
  res.redirect("/listings");
});

store.on("error",(err)=>{
  console.log("error in the mongo session store",err);
})

const sessionOption = {
  store,
  secret : process.env.SECRET,
  resave: false,
  saveuninitialized : true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// View engine and middlewares
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));



app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


// Listings route
app.use("/listings", listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// Start the server
app.listen(port, () => {
  console.log(`The server is listening at port : ${port}`);
});
