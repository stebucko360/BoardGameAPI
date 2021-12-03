const db = require('../db/connection');

exports.fetchAllUsers = ()=>{
    return db.query(`SELECT username FROM users;`)
    .then((result)=>{
        return result.rows
    });
};

exports.fetchUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`,
    [username])
    .then((result)=>{
        return result.rows[0]
    });
};