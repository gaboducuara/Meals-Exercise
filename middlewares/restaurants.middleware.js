// Models
const { Restaurant } = require('../models/restaurants.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const restaurantExists = catchAsync(async (req, res, next) => {
	const { restaurantId, id } = req.params;

	const restaurant = await Restaurant.findOne({
		where: { id: restaurantId || id, status: 'active' },
	});

	if (!restaurant) {
		return next(new AppError('Restaurant not found', 404));
	}

	req.restaurant = restaurant;
	next();
});

module.exports = { restaurantExists };

// const commentExists = catchAsync(async (req, res, next) => {
// 	const { id } = req.params;

// 	const comment = await Comment.findOne({ where: { id } });

// 	if (!comment) {
// 		return next(new AppError('Comment not found', 404));
// 	}

// 	req.comment = comment;
// 	next();
// });

// module.exports = { commentExists };
