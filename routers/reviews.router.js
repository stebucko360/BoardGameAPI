const express = require('express');
const {fetchReviewById} = require('../controllers/reviews.controller');


const reviewsRouter = express.Router();

reviewsRouter.route('/:review_id').get(fetchReviewById)

module.exports = reviewsRouter;