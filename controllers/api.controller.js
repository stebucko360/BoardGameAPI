const { getAllEndPoints } = require('../models/api.model');

exports.listAllEndPoints = (req, res, next) =>{
    
    res.status(200).send({endPoints: getAllEndPoints()})
}