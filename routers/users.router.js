const express = require('express');
const { getAllUsers } = require('../controllers/users.controller');

const usersRouter = express.Router();

usersRouter.route('/').get(getAllUsers);

module.exports = usersRouter;