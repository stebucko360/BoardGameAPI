const db = require('../db/connection');

exports.fetchCategoriesData = ()=>{
    const queryString = `SELECT * FROM categories`;

    return db.query(queryString)
    .then((result)=>{
        return result.rows;
    })
};