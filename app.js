var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cas = require('connect-cas');

cas.configure({
    protocol: 'http',
    host: 'ids.ynu.edu.cn',
    port: 80,
    paths: {
        validate: '/authserver/validate',
        serviceValidate: '/authserver/serviceValidate',
        login: '/authserver/login',
        logout: '/authserver/logout'
    }
});

var routes = require('./routes/default');
var routes_xkdm = require('./routes/xkdm');
var routes_xktj = require('./routes/xktj');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// http://stackoverflow.com/questions/19696240/proper-way-to-return-json-using-node-or-express
// JSON response spaces for formatting, defaults to 2 in development, 0 in production
app.set('json spaces', 2);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'ynu_xktj'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/xkdm', routes_xkdm);
app.use('/xktj', routes_xktj);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
