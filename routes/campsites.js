var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Comment    = require("../models/comment"),
    Campsite   = require("../models/campsite"),
    NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// ====== Campsite routes ========
router.get("/", function(req, res){
    // get all campsites from db
    Campsite.find({}, function(err, campsites){
        if(err){
            console.log(err);
        }else {
            res.render("campsites/index", {campsites: campsites});
        }
    })
});
// the form to add a new campsite to the db
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campsites/new");
});
// adds a new campsite to the database
router.post("/", middleware.isLoggedIn, function(req, res){
     // get data from form 
    var name = req.body.name;
    var image = req.body.image;
    var url = req.body.url;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }

        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;

        // add to campsites db
        var newCampsite = {name: name, image: image, url: url, description: description, location: location, lat: lat, lng: lng, price: price, author: author}
        Campsite.create(newCampsite, function(err, newlyCreated){
            if(err){
                req.flash('error', 'Something went wrong');
                res.redirect("/campsites/new");
            } else{
                res.redirect("/campsites/" + newlyCreated._id);
            }
        })
    });
});
// shows info about the one of the campsites
router.get("/:id", function(req, res){
    // find the campsite with the provided id
    Campsite.findById(req.params.id).populate("comments").exec(function(err, foundCampsite){
        if(err){
            console.log(err);
        } else {
            // render the show template with the requested campsite
            res.render("campsites/show", {campsite: foundCampsite});
        }
    });  
});
// Edit a campsite
router.get("/:id/edit", middleware.checkCampsiteOwner, function(req, res, next){
        Campsite.findById(req.params.id, function(err, foundCampsite){
            res.render("campsites/edit", {campsite: foundCampsite});
        });
});
                

// update the campsite
router.put("/:id", middleware.checkCampsiteOwner, function(req, res){
    geocoder.geocode(req.body.campsite.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }

        var campsite = req.body.campsite
        campsite.lat = data[0].latitude;
        campsite.lng = data[0].longitude;
        campsite.location = data[0].formattedAddress;
  
        Campsite.findByIdAndUpdate(req.params.id, campsite, function(err, updated){
            if(err){
                req.flash("error", err.message);
                res.redirect("/campsites")
            } else {
                req.flash("success","Successfully Updated.");
                res.redirect("/campsites/" + req.params.id);
            }
        });
    });
});
// Destroy a campsite
router.delete("/:id", middleware.checkCampsiteOwner, function(req, res, next){
    Campsite.findById(req.params.id, function(err, campsite){
        Comment.remove({
            "_id": {
                $in: campsite.comments
            }
        }, function(err){
            if(err) return next(err);
            campsite.remove();
            req.flash("success", "Sucessfully deleted");
            res.redirect("/campsites");
        })
    });
});

module.exports = router;