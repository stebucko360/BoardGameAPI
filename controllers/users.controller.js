const { fetchAllUsers } = require('../models/users.model');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers().then((result)=>{
        res.status(200).send({users: result})
    }).then((err)=>{
        next(err)
    });
};