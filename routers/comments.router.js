const express = require('express');
const {deleteCommentById, addVoteToCommentbyId} = require('../controllers/comments.controller');

const commentsRouter = express.Router();

commentsRouter.route('/:comment_id').delete(deleteCommentById).patch(addVoteToCommentbyId)



module.exports = commentsRouter;