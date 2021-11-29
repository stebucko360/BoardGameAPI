const {getReviewById} = require('../models/reviews.model');

exports.fetchReviewById = (req, res, next) =>{
    const {review_id} = req.params;
    getReviewById(review_id).then((result)=>{
        res.status(200).send({review: result})
    }).catch((err)=>{
        next(err)
    })
}