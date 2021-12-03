const { removeCommentById, checkCommentExists, sumVoteToCommentById } = require('../models/comments.model');

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;

    Promise.all([checkCommentExists(comment_id), removeCommentById(comment_id)])
    .then((result)=>{
        res.status(204).send({})
    }).catch((err)=>{
        next(err)
    });
};

exports.addVoteToCommentbyId = (req, res, next) =>{
    const { comment_id } = req.params;
    const vote = req.body.inc_votes
    
    sumVoteToCommentById(comment_id, vote).then((result)=>{
        res.status(200).send({comment: result})
    }).catch((err)=>{
        next(err)
    });
};