const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/users.model');
const { Order } = require('../models/orders.model');
const { Meal } = require('../models/meals.model');
const { Restaurant } = require('../models/restaurants.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

// Gen secrets for JWT, require('crypto').randomBytes(64).toString('hex')

dotenv.config({ path: './config.env' });

const PostcreateUser = catchAsync(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// Hash password
	const salt = await bcrypt.genSalt(12);
	const hashPassword = await bcrypt.hash(password, salt);

	const newUser = await User.create({
		name,
		email,
		password: hashPassword,
		role,
	});

	// Remove password from response
	newUser.password = undefined;

	res.status(201).json({
		status: 'success',
		newUser,
	});
});

const PostloginUser = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate credentials (email)
	const loginUser = await User.findOne({
		where: {
			email,
			status: 'active',
		},
	});

	if (!loginUser) {
		return next(new AppError('Credentials invalid', 400));
	}

	// Validate password
	const isPasswordValid = await bcrypt.compare(password, loginUser.password);

	if (!isPasswordValid) {
		return next(new AppError('Credentials invalid', 400));
	}

	// Generate JWT (JsonWebToken) ->
	const token = await jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	// Send response
	res.status(200).json({
		status: 'success',
		token,
	});
});

const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.findAll({
		where: { status: 'active' },
		attributes: ['id', 'name', 'email', 'status', 'role'],
	});

	res.status(201).json({
		status: 'success',
		users,
	});
});

const updateUser = catchAsync(async (req, res, next) => {
	const { user } = req;
	const { name, email } = req.body;

	await user.update({ name, email });

	res.status(201).json({ status: 'success', user });
});

const deleteUser = catchAsync(async (req, res, next) => {
	const { user } = req;

	// await user.destroy();
	await user.update({ status: 'inactive' });

	res.status(201).json({ status: 'success', user });
});

const getAllOrders = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;
	const id = sessionUser.id;

	const orderUser = await User.findOne({
		where: { status: 'active', id },
		attributes: ['id', 'name', 'email', 'status', 'role'],
		include: [
			{
				model: Order,
				attributes: [
					'id',
					'mealId',
					'userId',
					'totalPrice',
					'quantity',
					'status',
				],
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
			},
		],
	});

	res.status(201).json({
		status: 'success',
		orderUser,
	});
});

const getOrdersById = catchAsync(async (req, res, next) => {
	const { order } = req;
	const id = order.id;

	const orderById = await Order.findOne({
		where: { status: 'active', id },
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
		orderById,
	});
});

module.exports = {
	PostcreateUser,
	PostloginUser,
	updateUser,
	deleteUser,
	getAllOrders,
	getOrdersById,
	getAllUsers,
};
