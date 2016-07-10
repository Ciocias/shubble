var express = require('express');
var cfg = require('_/cfg');

var app = express();

// template engine setup
app.set('views', cfg.view_dir);
app.set('view engine', 'jade');
app.locals.cfg = cfg;

// middleware setup
app.use(express.static(cfg.pub_dir));
app.use(require('./routes.js'));

module.exports = app;
