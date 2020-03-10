
require('dotenv').config();
var express    = require("express"),
    app        = express(),
    session    = require('express-session'),
    bodyParser = require("body-parser"),
    flash      = require("connect-flash"),
    mongoose   = require("mongoose"),
    MongoStore = require('connect-mongo')(session),
    methodOverride = require("method-override"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    seedDB     = require("./seeds"),
    User       = require("./models/user");                                    

var indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comments"),
    campsiteRoutes = require("./routes/campsites");

mongoose.connect("mongodb://localhost/campsiteReviews", { useNewUrlParser: true, useUnifiedTopology: true });   
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
seedDB();

// passport Config
app.use(require("express-session")({
    secret: "Haldi is the worlds cutest dog!",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    // passes the current user to every template
    res.locals.currentUser = req.user;
    res.locals.path = req.path
    // passes message for flash to every template
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campsites/:id/comments",commentRoutes);
app.use("/campsites", campsiteRoutes);



app.listen(3000, function() { 
    console.log('YelpCamp on port 3000'); 
  });