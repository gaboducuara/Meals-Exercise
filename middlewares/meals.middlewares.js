// Models
const { Meal } = require('../models/meals.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const mealExists = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const { mealId } = req.body;

	const meal = await Meal.findOne({
		where: { id: id || mealId, status: 'active' },
	});

	if (!meal) {
		return next(new AppError('Meal not found', 404));
	}

	req.meal = meal;
	next();
});

module.exports = { mealExists };
