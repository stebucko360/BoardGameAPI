const db = require('../db/connection');

exports.getReviewById = (review_id)=>{
    //NEEDS REFACTOR TO CHECK IS REVIEW_ID EXISTS WITH PROMISE.ALL
    return db.query(`
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, reviews.review_img_url,
    reviews.category, reviews.created_at, reviews.votes FROM reviews WHERE reviews.review_id = $1;`, [review_id])
    .then((result)=>{
        const queryString = `SELECT COUNT(review_id) AS comment_count FROM comments WHERE review_id = $1;`;
        
       return Promise.all([result, db.query(queryString, [review_id])])
    }).then(([reviewObj, commentCount])=>{
        
       if(reviewObj.rows.length === 0){
           return Promise.reject({status: 400, msg:'Invalid review_id'})
       } else {
           const reviewObject = reviewObj.rows[0];
           reviewObject['comment_count'] = commentCount.rows[0].comment_count
           return reviewObject;

       }
    });
};

exports.editVotesById = (review_id, newVotes)=>{
    if(!newVotes){return Promise.reject({status: 400, msg:'Invalid vote key'})}
    
    return db.query(`UPDATE reviews SET votes = (votes + $1)
    WHERE review_id = $2 RETURNING *`, [newVotes, review_id])
    .then((result)=>{
        return result.rows[0]
    });
};

exports.getReviews = (sort_by = 'created_at', order = 'asc', category)=>{
    if(!['title', 'owner', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'count'].includes(sort_by)){
        return Promise.reject({status: 400, msg: 'Invalid sort query'})
    }
    if(!['asc', 'desc'].includes(order)){
        return Promise.reject({status: 400, msg: 'Invalid order query'})
    }

    let queryValues = [];
    let queryString = `SELECT owner, title, reviews.review_id, category, review_img_url,
    reviews.created_at, reviews.votes, COUNT(comments.review_id ) AS comment_count FROM reviews LEFT JOIN comments 
    ON comments.review_id = reviews.review_id GROUP BY owner, title, reviews.review_id, category, review_img_url,
    reviews.created_at, reviews.votes` 
    
    if(category){
        queryValues.push(category);
        queryString += ` WHERE category = $1`
    };
    
    queryString += ` ORDER BY ${sort_by} ${order};`

    return db.query(queryString, queryValues)
    .then((result)=>{
        console.log(result.rows);
        return result.rows;
    })
};
