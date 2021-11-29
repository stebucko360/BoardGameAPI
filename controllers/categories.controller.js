const {fetchCategoriesData} = require('../models/categories.model')

exports.getCategoryData = (req, res, next) => {

    fetchCategoriesData().then((response)=>{
        res.status(200).send({categories: response})
    }).catch((err)=>{
        next(err);
    })
}