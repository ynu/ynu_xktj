var express = require('express');
var cas = require('connect-cas');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

router.get('/ml', function(req, res, next) {
    sequelize.query("select distinct mldm, mlmc from xkdm", { type: sequelize.QueryTypes.SELECT})
        .then(function(ml_records) {
            res.json(ml_records);
        });
});
router.get('/yjxk', function(req, res, next) {
    sequelize.query("select distinct yjxkdm, yjxkmc from xkdm", { type: sequelize.QueryTypes.SELECT})
        .then(function(yjxk_records) {
            res.json(yjxk_records);
        });
});
router.get('/zy', function(req, res, next) {
    sequelize.query("select distinct zydm, zymc from xkdm", {type: sequelize.QueryTypes.SELECT})
        .then(function (zy_records) {
            res.json(yjxk_records);
        });
});

router.get('/', function(req, res, next) {

  models.xkdm.findAll().then(function(xkdms) {
    let xkdm_data = {};
    for(let xkdm of xkdms) {
        let mldm = xkdm.mldm;
        let mlmc = xkdm.mlmc;
        let yjxkdm = xkdm.yjxkdm;
        let yjxkmc = xkdm.yjxkmc;
        let zydm = xkdm.zydm;
        let zymc = xkdm.zymc;

        if(!(mldm in xkdm_data)) {
            xkdm_data[mldm] = {};
            xkdm_data[mldm].mlmc = mlmc;
            xkdm_data[mldm].yjxks = {};
        }
        if(!(yjxkdm in xkdm_data[mldm].yjxks)) {
            xkdm_data[mldm].yjxks[yjxkdm] = {};
            xkdm_data[mldm].yjxks[yjxkdm].yjxkmc = yjxkmc;
            xkdm_data[mldm].yjxks[yjxkdm].zys = [];
        }
        xkdm_data[mldm].yjxks[yjxkdm].zys.push({zydm: zydm, zymc: zymc});
    }
    res.json(xkdm_data);
  }).catch(function(err) {
    console.log(err);
    res.render('attend_failed', { title: 'customization' });
  }).finally(function() {
    // finally gets called always regardless of
    // whether the promises resolved with or without errors.
    // however this handler does receive any arguments.
  });

  // var xkdm_data = [];
  // sequelize.query("select distinct mldm, mlmc from xkdm", { type: sequelize.QueryTypes.SELECT})
  //     .then(function(mldm_records) {
  //       for(var mldm_record of mldm_records) {
  //           var mldm = mldm_record.mldm;
  //           var mlmc = mldm_record.mlmc;
  //           var mldm_data = {mc: mlmc};
  //           var yjxks = [];
  //           mldm_data["yjxks"] = yjxks;
  //           sequelize.query("select distinct yjxkdm, yjxkmc from xkdm where mldm=\"" + mldm + "\"", { type: sequelize.QueryTypes.SELECT})
  //               .then(function(yjxk_records) {
  //                   for(var yjxk_record of yjxk_records) {
  //                       var yjxkdm = yjxk_record.yjxkdm;
  //                       var yjxkmc = yjxk_record.yjxkmc;
  //                       var yjxk_data = {mc: yjxkmc};
  //                       var zys = [];
  //                       yjxk_data["zys"] = zys;
  //                       sequelize.query("select distinct zydm, zymc from xkdm where yjxkdm=\"" + yjxkdm + "\"", {type: sequelize.QueryTypes.SELECT})
  //                           .then(function (zydm_records) {
  //                               for(var zydm_record of zydm_records) {
  //                                   var zydm = zydm_record.zydm;
  //                                   var zymc = zydm_record.zymc;
  //                                   zys.push({mc: zymc, zydm: zydm});
  //                               }
  //                           });
  //                       yjxks.push(yjxk_data);
  //                   }
  //
  //               });
  //           xkdm_data.push(mldm_data);
  //       }
  //     })
  //   setTimeout(function() {
  //       res.json(xkdm_data);
  //   }, 60000);

});

module.exports = router;
