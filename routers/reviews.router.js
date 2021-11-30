const express = require('express');
const {fetchReviewById, changeVotesById, fetchReviews} = require('../controllers/reviews.controller');


const reviewsRouter = express.Router();

reviewsRouter.route('/:review_id').get(fetchReviewById).patch(changeVotesById)
reviewsRouter.route('/').get(fetchReviews)

module.exports = reviewsRouter;