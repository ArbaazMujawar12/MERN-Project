const { model } = require("mongoose");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};


module.exports.signup = async(req,res,next)=>{
    try {
        let{username,email,password}=req.body;
        const newUser = new User({username,email});
        const registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>
            {
                if(err){
                    next(err);
                }
                 req.flash("success","Registered Sucessfully! Please Login");
                 res.redirect("/listings");
    });
       
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome to WanderLust! You are logged in!");
        res.redirect("/listings");
        
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You logged out successfully !");
        res.redirect("/listings");
    });
};