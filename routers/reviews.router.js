const express = require('express');
const {fetchReviewById, changeVotesById} = require('../controllers/reviews.controller');


const reviewsRouter = express.Router();

reviewsRouter.route('/:review_id').get(fetchReviewById).patch(changeVotesById)

module.exports = reviewsRouter;