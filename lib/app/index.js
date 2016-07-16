var cfg = require('_/cfg');
var log = require('_/log');
var events = require('./events.js');
var express = require('express');
var helmet = require('helmet');
var cookieparser = require('cookie-parser');
var bodyparser = require('body-parser');
var routes = require('./routes.js');

var app = express();

// template engine setup
app.set('views', cfg.view_dir);
app.set('view engine', 'jade');
app.locals.cfg = cfg;

// middleware setup
app.use(express.static(cfg.pub_dir));
app.use(helmet());
app.use(cookieparser());
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());

// routes registration
app.use(routes.router);
app.use('/api', routes.api_router);

// socket.io setup
var server = require('http').Server(app);
var io = require('socket.io')(server);

// listeners
io.on('connection', function (socket)
{
  socket.on(cfg.events.image.request, function ()
  {
    events.image(null, function(data) { socket.emit(cfg.events.image.ready, data); });
  });

  socket.on(cfg.events.quote.request, function ()
  {
    events.quote(function(data) { socket.emit(cfg.events.quote.ready, data); });
  });

  socket.on(cfg.events.name.request, function ()
  {
    events.name(function(data) { socket.emit(cfg.events.name.ready, data); });
  });
 
  socket.on(cfg.events.tweet.request, function (payload)
  {
    events.tweet(payload, function(err)
      {
        if (err)
        {
          if (err == 'Error: 401')
          {
            socket.emit('auth-error');
          }
        }
        else
        {
          socket.emit(cfg.events.tweet.ready);
        }
      });
  });
});

module.exports = server;
