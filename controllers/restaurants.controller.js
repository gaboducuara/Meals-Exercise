// Models
const { Restaurant } = require('../models/restaurants.model');
const { Review } = require('../models/reviews.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const PostcreateRestaurant = catchAsync(async (req, res, next) => {
	const { name, address, rating } = req.body;

	const PostnewRestaurant = await Restaurant.create({
		name,
		address,
		rating,
	});
	res.status(201).json({
		status: 'success',
		PostnewRestaurant,
	});
});

const getAllRestaurant = catchAsync(async (req, res, next) => {
	const Allrestaurants = await Restaurant.findAll({
		where: { status: 'active' },
		attributes: ['id', 'name', 'address', 'rating', 'status'],
		include: [
			{
				model: Review,
				required: false,
				where: { status: 'active' },
				attributes: [
					'id',
					'userId',
					'comment',
					'restaurantId',
					'rating',
					'status',
				],
			},
		],
	});

	res.status(201).json({
		status: 'success',
		Allrestaurants,
	});
});

const getRestaurantById = catchAsync(async (req, res, next) => {
	const { restaurant } = req;
	const id = restaurant.id;

	const restaurantId = await Restaurant.findOne({
		where: { status: 'active', id },
		attributes: ['id', 'name', 'address', 'rating', 'status'],

		include: [
			{
				model: Review,
				required: false,
				where: { status: 'active' },
				attributes: [
					'id',
					'userId',
					'comment',
					'restaurantId',
					'rating',
					'status',
				],
			},
		],
	});

	res.status(201).json({
		status: 'success',
		restaurantId,
	});
});

const PatchupdateRestaurant = catchAsync(async (req, res, next) => {
	const { restaurant, sessionUser } = req;
	const { name, address } = req.body;

	const role = sessionUser.role;

	if (role === 'admin') {
		await restaurant.update({ name, address });
	} else {
		return next(new AppError('admin permission required', 400));
	}
	res.status(201).json({ status: 'success', restaurant });
});

const DeleteRestaurant = catchAsync(async (req, res, next) => {
	const { restaurant, sessionUser } = req;

	const role = sessionUser.role;

	if (role === 'admin') {
		await restaurant.update({ status: 'disabled' });
	} else {
		return next(new AppError('admin permission required', 400));
	}

	res.status(201).json({ status: 'success', restaurant });
});

const PostcreateReviewsRestaurant = catchAsync(async (req, res, next) => {
	const { restaurant, sessionUser } = req;
	const { comment, rating } = req.body;

	if (rating < 1 || rating > 10) {
		return next(new AppError('rating must be between 1-10', 400));
	} else {
		const newReview = await Review.create({
			userId: sessionUser.id,
			comment,
			restaurantId: restaurant.id,
			rating,
		});

		res.status(201).json({
			status: 'success',
			newReview,
		});
	}
});

const PatchReviewsupdateRestaurant = catchAsync(async (req, res, next) => {
	const { review, sessionUser } = req;
	const { comment, rating } = req.body;

	if (sessionUser.id === review.userId) {
		await review.update({ comment, rating });
	} else {
		return next(new AppError('not the author of the review', 400));
	}
	res.status(201).json({ status: 'success', review });
});

const DeleteReviewsRestaurant = catchAsync(async (req, res, next) => {
	const { review, sessionUser } = req;

	if (sessionUser.id === review.userId) {
		await review.update({ status: 'deleted' });
	} else {
		return next(new AppError('not the author of the review', 400));
	}

	res.status(201).json({ status: 'success', review });
});

module.exports = {
	PostcreateRestaurant,
	getAllRestaurant,
	getRestaurantById,
	PatchupdateRestaurant,
	DeleteRestaurant,
	PostcreateReviewsRestaurant,
	PatchReviewsupdateRestaurant,
	DeleteReviewsRestaurant,
};
