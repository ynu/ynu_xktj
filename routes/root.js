var express = require('express');
var cas = require('connect-cas');
var url = require('url');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

var get_user = function(req) {
  var user = '';
  if (req.session.cas && req.session.cas.user) {
  	user = req.session.cas.user;
  }
  return user;
}

var get_attributes = function(req) {
  var attributes = '';
  if (req.session.cas && req.session.cas.attributes) {
    attributes = JSON.stringify(req.session.cas.attributes);
  }
  return attributes;
}

// cas.ssout                    : handle logout requests directly from the CAS server
// cas.serviceValidate()        : validate service tickets received from the CAS server
// cas.authenticate()           : request an authentication if the user is not authenticated
router.get('/', cas.ssout('/'), cas.serviceValidate(), cas.authenticate(), function(req, res) {
  var user_id = get_user(req);
  // check user and type
  models.user.findOne({
    where: {
      id: user_id
    }
  }).then(function (user) {
    if(user) {
      res.render('index', {user: user.id, type: user.type, attributes: get_attributes(req)});
    }
    else {
      res.render('message', {message: "user not found"});
    }
  });
});

// handle application logouts from the CAS logout page (in the browser)
router.get('/logout', function(req, res) {
  if (req.session.destroy) {
    req.session.destroy();
  } else {
    req.session = null;
  }
  var options = cas.configure();
  options.pathname = options.paths.logout;
  return res.redirect(url.format(options));
});

module.exports = router;
