const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');

const expressError = require('../utils/expressError');
const Campground = require('../model/campground');

const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new expressError(msg, 400);
	} else {
		next();
	}
};

router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});

router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground) throw new expressError('Invalid campground data', 404);
		// console.log(result);
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash('success', 'Successfully made a new Campground');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate('reviews');
		if (!campground) {
			req.flash('error', 'Cannot find the Campground you are looking for.');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);

router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash('error', 'Cannot find the Campground you are looking for.');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
	})
);

router.put(
	'/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
		req.flash('success', 'Successfully updated Campground');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash('success', 'Successfully deleted a Campground!');

		res.redirect('/campgrounds');
	})
);

module.exports = router;
