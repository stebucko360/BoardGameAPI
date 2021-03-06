const express = require('express');
const { getAllUsers, getUserByUsername } = require('../controllers/users.controller');

const usersRouter = express.Router();

usersRouter.route('/').get(getAllUsers);
usersRouter.route('/:username').get(getUserByUsername)

module.exports = usersRouter;