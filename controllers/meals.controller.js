// Models
// const { Review } = require('../models/reviews.model');
// const { User } = require('../models/users.model');
const { Restaurant } = require('../models/restaurants.model');
const { Meal } = require('../models/meals.model');
// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const PostcreateMeals = catchAsync(async (req, res, next) => {
	const { restaurant } = req;
	const { name, price } = req.body;
	const newPostMeal = await Meal.create({
		name,
		price,
		restaurantId: restaurant.id,
	});
	res.status(201).json({
		status: 'success',
		newPostMeal,
	});
});

const getAllMeals = catchAsync(async (req, res, next) => {
	const getMeal = await Meal.findAll({
		where: { status: 'active' },
		include: [
			{
				model: Restaurant,
				attributes: ['id', 'name', 'address', 'rating', 'status'],
			},
		],
	});
	res.status(201).json({ status: 'success', getMeal });
});

const getMealsById = catchAsync(async (req, res, next) => {
	const { Meal } = req;
	const id = Meal.id;
	const MealByid = await Meal.findOne({
		where: { status: 'active', id: id },
		attributes: ['id', 'name', 'price', 'restaurantId', 'status'],
		include: [
			{
				model: Restaurant,
				attributes: ['id', 'name', 'address', 'rating', 'status'],
			},
		],
	});
	res.status(201).json({
		status: 'success',
		MealByid,
	});
});

const PatchUpdateMeals = catchAsync(async (req, res, next) => {
	const { meal, sessionUser } = req;
	const { name, price } = req.body;
	const role = sessionUser.role;

	if (role === 'admin') {
		await Meal.update({ name, price });
	} else {
		return next(new AppError('admin permission required', 400));
	}
	res.status(201).json({ status: 'success', meal });
});

const deleteMeals = catchAsync(async (req, res, next) => {
	const { meal, sessionUser } = req;
	const role = sessionUser.role;

	if (role === 'admin') {
		await Meal.update({ status: 'deleted' });
	} else {
		return next(new AppError('admin permission required', 400));
	}

	res.status(201).json({ status: 'success', meal });
});

module.exports = {
	PostcreateMeals,
	getAllMeals,
	getMealsById,
	PatchUpdateMeals,
	deleteMeals,
};
