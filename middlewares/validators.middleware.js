const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// Array has errors
		const errorMsgs = errors.array().map(err => err.msg);

		const message = errorMsgs.join('. ');

		return next(new AppError(message, 400));
	}

	next();
};

//users
const createUserValidators = [
	body('name')
		.notEmpty()
		.withMessage('Name cannot be empty')
		.isString()
		.withMessage('Name is not a string'),
	body('email').isEmail().withMessage('Must provide a valid email'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters long')
		.isAlphanumeric()
		.withMessage('Password must contain letters and numbers'),
	body('role')
		.notEmpty()
		.withMessage('Role cannot be empty')
		.isString()
		.withMessage('Role is not a string'),

	checkResult,
];

//Restaurants
const createRestaurantValidators = [
	body('name')
		.notEmpty()
		.withMessage('name cannot be empty')
		.isString()
		.withMessage('name is not a string'),
	body('address')
		.notEmpty()
		.withMessage('address cannot be empty')
		.isString()
		.withMessage('address is not a string'),
	body('rating')
		.notEmpty()
		.withMessage('rating cannot be empty')
		.isNumeric()
		.withMessage('rating is not a number'),
	checkResult,
];

//Meals
const createMealValidators = [
	body('name')
		.notEmpty()
		.withMessage('name cannot be empty')
		.isString()
		.withMessage('name is not a string'),
	body('price')
		.notEmpty()
		.withMessage('price cannot be empty')
		.isNumeric()
		.withMessage('price is not a number'),
	checkResult,
];

//Orders
const createOrderValidators = [
	body('mealId')
		.notEmpty()
		.withMessage('mealId cannot be empty')
		.isNumeric()
		.withMessage('mealId is not a number'),
	body('quantity')
		.notEmpty()
		.withMessage('quantity cannot be empty')
		.isNumeric()
		.withMessage('quantity is not a number'),
	checkResult,
];

//Review
const createReviewValidators = [
	body('comment')
		.notEmpty()
		.withMessage('Comment cannot be empty')
		.isString()
		.withMessage('Comment must be a string'),
	body('rating')
		.notEmpty()
		.withMessage('rating cannot be empty')
		.isNumeric()
		.withMessage('rating is not a number'),
	checkResult,
];
module.exports = {
	createUserValidators,
	createRestaurantValidators,
	createMealValidators,
	createOrderValidators,
	createReviewValidators,
};
