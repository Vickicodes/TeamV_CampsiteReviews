var express = require("express"),
    router = express.Router(),
    passport   = require("passport"),
    middleware = require("../middleware"),
    User       = require("../models/user");

// ======= Home Page ===========
router.get("/", function(req, res){
    res.render("home");
});

// ===== Auth Routes =========
router.get("/register", function(req, res){
    res.render("register");
});
router.post("/register", function(req, res){
    req.body.username = req.body.username.toLowerCase();
    var newUser = new User({username: req.body.username});
    if(req.body.password === req.body.confirm){
        User.register(newUser, req.body.password, function(err, user){
            if(err){
                req.flash("error", err.message);
                res.render("register")
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome " + user.username);
                res.redirect("/campsites");
            });
        });
    } else {
        req.flash("error", "Passwords do not match")
        res.redirect("/register");
    }
    
});
router.get("/login", function(req, res){
    res.render("login");
});
router.post("/login",middleware.usernameToLowerCase, passport.authenticate("local", 
    {
    successRedirect: "/campsites",
    failureRedirect: "/login",
    failureFlash: true
    }), function(req, res){});
    
router.get("/logout", function (req, res){
    req.logout();
    req.flash("success", "Successfully logged out.")
    res.redirect("/campsites");
});    


module.exports = router;