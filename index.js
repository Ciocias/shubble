'use-strict';

var cfg = require('_/cfg');
var log = require('_/log');
var app = require('_/app');

// we save the http.Server return from app.listen
// to close gracefully later on
var server = app.listen(cfg.port);
log.info('app listening on port', cfg.port);

process.on('SIGQUIT', () => {
  server.close();

  log.info('bye bye!');
  process.exit();
});
