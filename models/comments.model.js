const db = require('../db/connection');

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`,
    [comment_id])
    .then((result)=>{
        return result.command;
    });
};

exports.checkCommentExists = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1;`,
    [comment_id])
    .then((result)=>{
        if(result.rowCount === 0) {
            return Promise.reject({status:400, msg: 'Comment does not exist'})
        } else
        return result;
    });
};

exports.sumVoteToCommentById = (comment_id, vote) =>{
    if(![1, -1].includes(vote)){
        return Promise.reject({status: 400, msg: 'Invalid key/value'})
    }

    return db.query(`UPDATE comments SET votes = votes + ($1) 
    WHERE comment_id = $2 RETURNING *;`,
     [vote, comment_id])
     .then((result)=>{
        return result.rows[0]
     });
};