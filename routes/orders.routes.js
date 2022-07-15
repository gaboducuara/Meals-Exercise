const express = require('express');

const {
	PostcreateOrders,
	getAllOrders,
	PatchUpdateOrders,
	deleteOrders,
} = require('../controllers/orders.controller');

//middlewares
const { createOrderValidators } = require('../middlewares/validators.middleware');

const { orderExists } = require('../middlewares/orders.middlewares');
const { mealExists } = require('../middlewares/meals.middlewares');
const { protectWorkSession } = require('../middlewares/auth.middleware');

const ordersRouter = express.Router();

ordersRouter.use(protectWorkSession);

ordersRouter.post('/', mealExists, PostcreateOrders, createOrderValidators);

ordersRouter.get('/me', getAllOrders);

ordersRouter
	.use('/:id', orderExists)
	.route('/:id')
	.patch(PatchUpdateOrders)
	.delete(deleteOrders);

module.exports = { ordersRouter };
