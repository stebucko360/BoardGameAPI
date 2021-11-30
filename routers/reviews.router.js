const express = require('express');
const {fetchReviewById, changeVotesById, fetchReviews, fetchCommentsById, postComment} = require('../controllers/reviews.controller');


const reviewsRouter = express.Router();

reviewsRouter.route('/:review_id').get(fetchReviewById).patch(changeVotesById)
reviewsRouter.route('/').get(fetchReviews)
reviewsRouter.route('/:review/comments').get(fetchCommentsById).post(postComment)

module.exports = reviewsRouter;