const { fetchAllUsers, fetchUserByUsername } = require('../models/users.model');

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers().then((result)=>{
        res.status(200).send({users: result})
    }).then((err)=>{
        next(err)
    });
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    fetchUserByUsername(username).then((result)=>{
        res.status(200).send({user: result})
    }).catch((err)=>{
        next(err)
    });
};