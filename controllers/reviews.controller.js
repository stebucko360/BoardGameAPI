const {
    getReviewById, 
    editVotesById, 
    getReviews, 
    getCommentsById, 
    addComment,
    checkReviewIdExists
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
        res.status(201).send({review: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.fetchReviews = (req, res, next) => {
    const {sort_by, order, category} = req.query;

    getReviews(sort_by, order).then((result)=>{
        res.status(200).send({reviews: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.fetchCommentsById = (req, res, next) => {
    const review_id = req.params.review;

    getCommentsById(review_id).then((result)=>{
        res.status(200).send({review: result})
    }).catch((err)=>{
        next(err)
    });
};

exports.postComment = (req, res, next) => {
    const review_id = req.params.review;
    const {username, body} = req.body;

    addComment(review_id, username, body).then((result)=>{
        res.status(201).send({review: result})
    }).catch((err)=>{
        next(err)
    });
};