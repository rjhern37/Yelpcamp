const express = require('express');
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');

const Campground = require('../model/campground');
const Review = require('../model/review');

router.post(
	'/',
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash('success', 'Successfully created a new Campground review!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		//destructed id and reviewID from params
		const { id, reviewId } = req.params;
		//awaits campground and finds by ID, then pulls reviewID from reviews in mongoDB
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		//Finds reviewID and deletes
		await Review.findByIdAndDelete(reviewId);

		req.flash('success', 'Successfully deleted a Campground review!');

		//redirect back to campground show page
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
