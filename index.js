'use-strict';

var cfg = require('_/cfg');
var log = require('_/log');
var app = require('_/app');

// we save the http.Server return from app.listen
// to close gracefully later on
var server = app.listen(cfg.port);
log.info('app listening on port', cfg.port);

// Close express server on exit
function on_close ()
{
  server.close();

  log.info('bye bye!');
  process.exit();
}

// Catch ctrl+C and ctrl+\
process.on('SIGINT', on_close);
process.on('SIGQUIT', on_close);
