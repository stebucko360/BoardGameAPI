const {
    getReviewById, 
    editVotesById, 
    getReviews, 
    getCommentsById, 
    addComment,
    checkReviewIdExists,
    checkCategoryExists,
    addReview
} = require('../models/reviews.model');

exports.fetchReviewById = (req, res, next) =>{
    const {review_id} = req.params;

    Promise.all([checkReviewIdExists(review_id), getReviewById(review_id)])
    .then(([check ,result])=>{
        res.status(200).send({review: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.changeVotesById = (req, res, next) => {
    const {review_id} = req.params;
    const newVotes = req.body.inc_votes;

    editVotesById(review_id, newVotes).then((result)=>{
        res.status(200).send({review: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.fetchReviews = (req, res, next) => {
    const {sort_by, order, category, page, limit} = req.query;

    Promise.all([checkCategoryExists(category), getReviews(sort_by, order, category, page, limit)]).then(([check ,result])=>{
        res.status(200).send({reviews: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.fetchCommentsById = (req, res, next) => {
    const review_id = req.params.review;

    Promise.all([checkReviewIdExists(review_id), getCommentsById(review_id)]).then(([,result])=>{
        res.status(200).send({comments: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.postComment = (req, res, next) => {
    const review_id = req.params.review;
    const {username, body} = req.body;
Promise.all([checkReviewIdExists(review_id), addComment(review_id, username, body)])
    .then(([,result])=>{
        res.status(201).send({review: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.postReview = (req, res, next) => {
    const {owner, title, review_body, designer, category} = req.body;
    addReview(owner, title, review_body, designer, category).then((result)=>{
        res.status(201).send({review: result})
    }).catch((err)=>{
        next(err)
    });
};