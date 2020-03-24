require('dotenv').config();

const express = require('express'),
	app = express(),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	mongoose = require('mongoose'),
	MongoStore = require('connect-mongo')(session),
	methodOverride = require('method-override'),
	passport = require('passport'),
	localStrategy = require('passport-local'),
	seedDB = require('./seeds'),
	User = require('./models/user'),
	url = process.env.MONGODB_URI || 'mongodb://localhost/campsite_reviews',
	PORT = process.env.PORT || 5000,
	indexRoutes = require('./routes/index'),
	commentRoutes = require('./routes/comments'),
	campsiteRoutes = require('./routes/campsites');

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');
app.set('view engine', 'ejs');

seedDB();

// ============ Passport Config ===========================
app.use(
	require('express-session')({
		secret: process.env.SESSION_SECRET || 'This is here to help with the set up my app locally',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===== Pass User and Flash message to each template ==========
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.path = req.path;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
// ============ Route Set up =========================
app.use('/', indexRoutes);
app.use('/campsites/:id/comments', commentRoutes);
app.use('/campsites', campsiteRoutes);

app.listen(PORT, function() {
	console.log('Campsite Reviews on port');
});
