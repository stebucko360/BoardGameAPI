const {getReviewById, editVotesById} = require('../models/reviews.model');

exports.fetchReviewById = (req, res, next) =>{
    const {review_id} = req.params;
    getReviewById(review_id).then((result)=>{
        res.status(200).send({review: result})
    }).catch((err)=>{
        next(err)
    })
};

exports.changeVotesById = (req, res, next) => {
    const {review_id} = req.params;
    const newVotes = req.body.inc_votes;

    editVotesById(review_id, newVotes).then((result)=>{
        res.status(201).send({review: result})
    }).catch((err)=>{
        next(err)
    })
};