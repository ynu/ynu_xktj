var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

router.get('/relevant/by_id/:id', function(req, res, next) {
    let id = req.params.id;
    sequelize.query("select * from xktj where szxy = (select szxy from xktj where id=:user_id)", { replacements: { user_id: id }, type: sequelize.QueryTypes.SELECT})
        .then(function(xktjs) {
            res.json(xktjs);
        });
});

router.get('/relevant/by_szxy/:szxy', function(req, res, next) {
    let szxy = req.params.szxy;
    models.xktj.findAll({
        where: {
            szxy: szxy
        }
    }).then(function (xktjs) {
        res.json(xktjs);
    });
});

router.get('/xy/', function(req, res, next) {
    sequelize.query("select distinct szxy from xktj", { type: sequelize.QueryTypes.SELECT})
        .then(function(szxys) {
            res.json(szxys);
        });
});

router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    models.xktj.findOne({
        where: {
            id: id
        }
    }).then(function (xktj) {
        res.json(xktj);
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