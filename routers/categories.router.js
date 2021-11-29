const express = require('express');
const { apiRouter } = require('./api.router');
const { getCategoryData } = require('../controllers/categories.controller');

const categoriesRouter = express.Router();

categoriesRouter.route('/').get(getCategoryData)

module.exports = categoriesRouter;