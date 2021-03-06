const db = require('../db/connection');

exports.getReviewById = (review_id)=>{
    return db.query(`
    SELECT reviews.owner AS username, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, reviews.review_img_url,
    reviews.category, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments 
    ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`, [review_id])
    .then((result)=>{
        return result.rows[0];
    })
    
};

exports.checkReviewIdExists = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((result)=>{
        if(result.rowCount === 0) {
            return Promise.reject({status:404, msg:'review_id does not exist'})
        }
        else return 
    })
}

exports.editVotesById = (review_id, newVotes)=>{
    if(!newVotes){return Promise.reject({status: 400, msg:'Invalid vote key'})}
    
    return db.query(`UPDATE reviews SET votes = (votes + $1)
    WHERE review_id = $2 RETURNING *`, [newVotes, review_id])
    .then((result)=>{
        if(result.rowCount === 0) {
            return Promise.reject({status:404, msg:'review_id does not exist'})
        }
        return result.rows[0]
    });
};

exports.getReviews = (sort_by = 'created_at', order = 'desc', category, page = '1', limit )=>{
    if(!['title', 'owner', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'count'].includes(sort_by)){
        return Promise.reject({status: 400, msg: 'Invalid sort query'})
    }
    if(!['asc', 'desc'].includes(order)){
        return Promise.reject({status: 400, msg: 'Invalid order query'})
    }

    let queryValues = [];
    let queryString = `SELECT owner, title, reviews.review_id, category, review_img_url,
    reviews.created_at, reviews.votes, COUNT(comments.review_id ) AS comment_count FROM reviews LEFT JOIN comments 
    ON comments.review_id = reviews.review_id` 
    
    if(category){
        queryValues.push(category);
        queryString += ` WHERE category = $1`
    };
    
    queryString += ` GROUP BY owner, title, reviews.review_id, category, review_img_url,
    reviews.created_at, reviews.votes ORDER BY ${sort_by} ${order};`

    
    return db.query(queryString, queryValues)
    .then((result)=>{
        if (limit !== undefined) {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            return result.rows.slice(startIndex, endIndex)
        } else {
            return result.rows;
        }
    })
};

exports.getCommentsById = (review_id) => {
    
    return db.query(`SELECT comment_id, votes, created_at, author, body
    FROM comments WHERE review_id = $1;`, [review_id])
    .then((result)=>{
        return result.rows;
    })
};

exports.addComment = (review_id, username, body) => {
    
    return db.query(`INSERT INTO comments
    (author, review_id, body)
    VALUES ($1, $2, $3)
    RETURNING *;`, [username, review_id, body])
    .then((result)=>{
        return result.rows[0]
    });
};

exports.checkCategoryExists = (category) =>{

    if(category === undefined){return}
    return db.query(`SELECT * FROM categories WHERE slug = $1;`, [category])
    .then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'category doesnt exist'})
        }
        return result
    });
};

exports.addReview = (owner, title, review_body, designer, category)=>{
    
    return db.query(`INSERT INTO reviews
    (owner, title, review_body, designer, category)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`, [owner, title, review_body, designer, category])
    .then((result)=>{
        return this.getReviewById(result.rows[0].review_id)
    });
};

