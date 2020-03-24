const express = require('express'),
	router = express.Router({ mergeParams: true }),
	middleware = require('../middleware'),
	Comment = require('../models/comment'),
	Campsite = require('../models/campsite');

//============== Comments routes ===========
router.get('/new', middleware.isLoggedIn, function(req, res) {
	Campsite.findById(req.params.id, function(err, campsite) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campsite: campsite });
		}
	});
});
// ============= Create Comment route ==================
router.post('/', middleware.isLoggedIn, function(req, res) {
	Campsite.findById(req.params.id, function(err, campsite) {
		if (err) {
			console.log(err);
			res.redirect('/campsites');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', 'Something went wrong');
					console.log(err);
				} else {
					// add the user to the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// connect the comment to the campsite
					campsite.comments.push(comment);
					campsite.save();
					// redirect to campsite show page
					req.flash('success', 'Successfully added your comment');
					res.redirect('/campsites/' + campsite._id);
				}
			});
		}
	});
});
//============= Update Comment route ======================
router.get('/:comment_id/edit', middleware.checkCommentOwner, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', { campsite_id: req.params.id, comment: foundComment });
		}
	});
});
router.put('/:comment_id', middleware.checkCommentOwner, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campsites/' + req.params.id);
		}
	});
});
//=========== Destroy comment route ==================
router.delete('/:comment_id', middleware.checkCommentOwner, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment sucessfully deleted.');
			res.redirect('/campsites/' + req.params.id);
		}
	});
});

module.exports = router;
