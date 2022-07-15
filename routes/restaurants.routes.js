const express = require('express');

// Controller
const {
	getAllRestaurant,
	getRestaurantById,
	PatchupdateRestaurant,
	PostcreateRestaurant,
	DeleteRestaurant,
	PostcreateReviewsRestaurant,
	PatchReviewsupdateRestaurant,
	DeleteReviewsRestaurant,
} = require('../controllers/restaurants.controller');

// Middlewares
const {
	createRestaurantValidators,
	createReviewValidators,
} = require('../middlewares/validators.middleware');

const { restaurantExists } = require('../middlewares/restaurants.middleware');

const { reviewExists } = require('../middlewares/reviews.middleware');

const { protectWorkSession } = require('../middlewares/auth.middleware');

const restaurantRouter = express.Router();

restaurantRouter.get('/', getAllRestaurant);

restaurantRouter.get('/:id', getRestaurantById, restaurantExists);

restaurantRouter.use(protectWorkSession);

restaurantRouter.post('/', PostcreateRestaurant, createRestaurantValidators);

restaurantRouter.post(
	'/reviews/:restaurantId',
	createReviewValidators,
	restaurantExists,
	PostcreateReviewsRestaurant
);

restaurantRouter
	.use('/reviews/:reviewId', reviewExists)
	.route('/reviews/:reviewId')
	.patch(PatchReviewsupdateRestaurant)
	.delete(DeleteReviewsRestaurant);

restaurantRouter
	.use('/:id', restaurantExists)
	.route(':/id')
	.patch(PatchupdateRestaurant)
	.delete(DeleteRestaurant);

module.exports = { restaurantRouter };
