// ======= Middleware =========
const middlewareObj = {},
      Campsite   = require("../models/campsite"),
      Comment    = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first.")
    res.redirect("/login");
};

middlewareObj.checkCampsiteOwner = function(req, res, next){
    // is the user signed in
    if(req.isAuthenticated()){
        Campsite.findById(req.params.id, function(err, foundCampsite){
            if(err){
                req.flash("error", "Campsite not found.");
                res.redirect("/campsites");
            } else {
                // does the user own the campsite
                if(foundCampsite.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please log in first.")
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwner = function(req, res, next){
    // is the user signed in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does the user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please log in first.");
        res.redirect("back");
    }
};
middlewareObj.usernameToLowerCase = function(req, res, next){
    req.body.username = req.body.username.toLowerCase();
    next();
}


module.exports = middlewareObj