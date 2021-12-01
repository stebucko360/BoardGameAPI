const { removeCommentById, checkCommentExists } = require('../models/comments.model');

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;

    Promise.all([checkCommentExists(comment_id), removeCommentById(comment_id)])
    .then((result)=>{
        res.status(204).send({})
    }).catch((err)=>{
        next(err)
    });
};