var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    models.xktj.findOne({
        where: {
        id: id
    }
    }).then(function (xktj) {
        let szxy = xktj.szxy;
        models.xktj.findAll({
            where: {
                szxy: szxy
            }
        }).then(function (xktjs) {
            res.json(xktjs);
        });
    });
});

router.post('/', function(req, res, next) {
    let xktj_in = req.body;
    models.xktj.update(xktj_in, {where: {id : xktj_in.id}}).then(function () {
        models.xktj.findOne({
            where: {
                id: xktj_in.id
            }
        }).then(function (xktj) {
            return res.json(xktj);
        });
    }).catch(function(err) {
        console.log(err);
    }).finally(function() {
        
    });;
});

module.exports = router;