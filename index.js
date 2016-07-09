'use-strict';

var cfg = require('_/cfg');
var log = require('_/log');
var app = require('_/app');

app.listen(cfg.port);
log.info('app listening on port', cfg.port);
