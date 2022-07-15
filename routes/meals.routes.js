const express = require('express');

// Controllers
const {
	PostcreateMeals,
	getAllMeals,
	getMealsById,
	PatchUpdateMeals,
	deleteMeals,
} = require('../controllers/meals.controller');

// Middlewares

const { createMealValidators } = require('../middlewares/validators.middleware');

const { restaurantExists } = require('../middlewares/restaurants.middleware');

const { mealExists } = require('../middlewares/meals.middlewares');

const { protectWorkSession } = require('../middlewares/auth.middleware');

const mealsRouter = express.Router();

mealsRouter.get('/', getAllMeals);

mealsRouter.get('/:id', mealExists, getMealsById);

mealsRouter.use(protectWorkSession);

mealsRouter.post('/', restaurantExists, createMealValidators, PostcreateMeals);

mealsRouter
	.use('/:id', mealExists)
	.route('/:id')
	.patch(PatchUpdateMeals)
	.delete(deleteMeals);

module.exports = { mealsRouter };
