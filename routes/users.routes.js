const express = require('express');

// Controllers
const {
	PostcreateUser,
	PostloginUser,
	updateUser,
	deleteUser,
	getAllOrders,
	getAllUsers,
	getOrdersById,
} = require('../controllers/users.controller');

// Middlewares
const { createUserValidators } = require('../middlewares/validators.middleware');
const { userExists } = require('../middlewares/users.middleware');
const { orderExists } = require('../middlewares/orders.middlewares');
const {
	protectWorkSession,
	protectUserAccount,
} = require('../middlewares/auth.middleware');

const usersRouter = express.Router();

usersRouter.post('/signp', createUserValidators, PostcreateUser);

usersRouter.post('/login', PostloginUser);

usersRouter.use(protectWorkSession);

usersRouter.get('/', getAllUsers);

usersRouter.get('/orders', getAllOrders);

usersRouter.get('/orders/:id', orderExists, getOrdersById);

usersRouter
	.use('/:id', userExists)
	.route('/:id')
	.patch(protectUserAccount, updateUser)
	.delete(protectUserAccount, deleteUser);

module.exports = { usersRouter };
