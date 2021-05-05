const express = require('express');
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require('../schemas');

const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

const Campground = require('../model/campground');
const Review = require('../model/review');

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new expressError(msg, 400);
	} else {
		next();
	}
};

router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		req.flash('success', 'Successfully created a new Campground review!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	'/:reviewId',
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
