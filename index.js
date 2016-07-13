'use-strict';

var cfg = require('_/cfg');
var log = require('_/log');
var app = require('_/app');

// we save the http.Server return from app.listen
// to close gracefully later on
var server = app.listen(cfg.port);
log.info('app listening on port', cfg.port);

// SIGINT makes npm chain of commands crash, so we handle SIGQUIT temporary
// even if it crashes the app, SIGQUIT allow the npm start script to continue
process.on('SIGQUIT', () => {
  server.close();

  log.info('bye bye!');
  process.exit();
});
