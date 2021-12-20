const express = require('express');
const {
    fetchReviewById, 
    changeVotesById, 
    fetchReviews, 
    fetchCommentsById, 
    postComment,
    postReview
} = require('../controllers/reviews.controller');


const reviewsRouter = express.Router();

reviewsRouter.route('/:review_id').get(fetchReviewById).patch(changeVotesById)
reviewsRouter.route('/').get(fetchReviews).post(postReview)
reviewsRouter.route('/:review/comments').get(fetchCommentsById).post(postComment)

module.exports = reviewsRouter;