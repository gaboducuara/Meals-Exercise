// Models
const { Order } = require('../models/orders.model');
const { Meal } = require('../models/meals.model');
const { Restaurant } = require('../models/restaurants.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const PostcreateOrders = catchAsync(async (req, res, next) => {
	const { WorksessionUser } = req;
	const { mealId, quantity } = req.body;

	const meal = await Meal.findOne({
		where: { status: 'active', id: mealId },
	});

	const total = meal.price * quantity;

	const CreatenewOrder = await Order.create({
		mealId,
		userId: WorksessionUser.id,
		totalPrice: total,
		quantity,
	});

	res.status(201).json({
		status: 'success',
		CreatenewOrder,
	});
});

const getAllOrders = catchAsync(async (req, res, next) => {
	const { WorksessionUser } = req;

	const getorder = await Order.findAll({
		where: { userId: WorksessionUser.id },
		attributes: ['id', 'mealId', 'userId', 'totalPrice', 'quantity', 'status'],
		include: [
			{
				model: Meal,
				attributes: ['id', 'name', 'price', 'restaurantId', 'status'],
				include: [
					{
						model: Restaurant,
						attributes: ['id', 'name', 'address', 'rating', 'status'],
					},
				],
			},
		],
	});

	res.status(201).json({
		status: 'success',
		getorder,
	});
});

const PatchUpdateOrders = catchAsync(async (req, res, next) => {
	const { order, WorksessionUser } = req;

	if (WorksessionUser.id === order.userId) {
		if (order.status === 'active') {
			await order.update({ status: 'completed' });
		} else {
			return next(new AppError('the order is not active', 400));
		}
	} else {
		return next(new AppError('not the author of the order', 400));
	}

	res.status(201).json({ status: 'success', order });
});

const deleteOrders = catchAsync(async (req, res, next) => {
	const { order, WorksessionUser } = req;

	if (WorksessionUser.id === order.userId) {
		if (order.status === 'active') {
			await order.update({ status: 'cancelled' });
		} else {
			return next(new AppError('the order is not active', 400));
		}
	} else {
		return next(new AppError('not the author of the order', 400));
	}

	res.status(201).json({ status: 'success', order });
});

module.exports = {
	PostcreateOrders,
	getAllOrders,
	PatchUpdateOrders,
	deleteOrders,
};
