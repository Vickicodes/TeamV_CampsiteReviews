const express = require('express'),
	router = express.Router(),
	middleware = require('../middleware'),
	Comment = require('../models/comment'),
	Campsite = require('../models/campsite'),
	NodeGeocoder = require('node-geocoder'),
	options = {
		provider: 'google',
		httpAdapter: 'https',
		apiKey: process.env.GEOCODER_API_KEY,
		formatter: null
	},
	geocoder = NodeGeocoder(options);

// ====== Campsite routes ========
router.get('/', function(req, res) {
	Campsite.find({}, function(err, campsites) {
		if (err) {
			console.log(err);
		} else {
			res.render('campsites/index', { campsites: campsites });
		}
	});
});
// ============= Create a new campsite ==================
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campsites/new');
});
//========== Add a new campsite to the database ==========
router.post('/', middleware.isLoggedIn, function(req, res) {
	let name = req.body.name;
	let image = req.body.image;
	let url = req.body.url;
	let price = req.body.price;
	let description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length) {
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		let lat = data[0].latitude;
		let lng = data[0].longitude;
		let location = data[0].formattedAddress;
		let newCampsite = {
			name: name,
			image: image,
			url: url,
			description: description,
			location: location,
			lat: lat,
			lng: lng,
			price: price,
			author: author
		};
		Campsite.create(newCampsite, function(err, newlyCreated) {
			if (err) {
				req.flash('error', 'Something went wrong');
				res.redirect('/campsites/new');
			} else {
				res.redirect('/campsites/' + newlyCreated._id);
			}
		});
	});
});
//============= Campsite Show route =============
router.get('/:id', function(req, res) {
	Campsite.findById(req.params.id).populate('comments').exec(function(err, foundCampsite) {
		if (err) {
			console.log(err);
		} else {
			res.render('campsites/show', { campsite: foundCampsite });
		}
	});
});

// =============== Edit a campsite route ================
router.get('/:id/edit', middleware.checkCampsiteOwner, function(req, res, next) {
	Campsite.findById(req.params.id, function(err, foundCampsite) {
		res.render('campsites/edit', { campsite: foundCampsite });
	});
});

//=============== Update a campsite route =========
router.put('/:id', middleware.checkCampsiteOwner, function(req, res) {
	geocoder.geocode(req.body.campsite.location, function(err, data) {
		if (err || !data.length) {
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}

		let campsite = req.body.campsite;
		campsite.lat = data[0].latitude;
		campsite.lng = data[0].longitude;
		campsite.location = data[0].formattedAddress;

		Campsite.findByIdAndUpdate(req.params.id, campsite, function(err, updated) {
			if (err) {
				req.flash('error', err.message);
				res.redirect('/campsites');
			} else {
				req.flash('success', 'Successfully Updated.');
				res.redirect('/campsites/' + req.params.id);
			}
		});
	});
});
//=========== Destroy a campsite route ================
router.delete('/:id', middleware.checkCampsiteOwner, function(req, res, next) {
	Campsite.findById(req.params.id, function(err, campsite) {
		Comment.remove(
			{
				_id: {
					$in: campsite.comments
				}
			},
			function(err) {
				if (err) return next(err);
				campsite.remove();
				req.flash('success', 'Sucessfully deleted');
				res.redirect('/campsites');
			}
		);
	});
});

module.exports = router;
