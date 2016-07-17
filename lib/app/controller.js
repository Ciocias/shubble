var log = require('_/log');
var cfg = require('_/cfg');
var oauth = require('_/oauth');
var events = require('./events.js');
var async = require('async');
var twitter = require('twitter');

exports.index = function (req, res)
{
  res.render('index');
};

exports.auth = function (req, res)
{
  var header = {
    callback:         cfg.host + ':' + cfg.port + '/callback',
    consumer_key:     cfg.secret.consumer_key,
    consumer_secret:  cfg.secret.consumer_secret
  };

  oauth.getToken(cfg.twitter.request_token, header, function(err, data)
  {
    if (data)
    {
      res.cookie('oauth_token', data.oauth_token, cfg.cookie);
      res.redirect(cfg.twitter.redirect + data.oauth_token);
    }
    else
    {
      if (err)
        log.error(err);

      res.status(404);
      res.render('404', { text: 'Make another call' });
    }

    return;
  });
};

exports.callback = function(req, res)
{
  //twitter dice di vedere se sono uguali
  if(req.cookies.oauth_token != req.query.oauth_token)
  {
    res.status(404);
    res.render('404', { text: 'make another call' });
    return;
  }
  var header = {
    token: req.query.oauth_token,
    verifier: req.query.oauth_verifier
  };

  oauth.getAccessToken(cfg.twitter.request_access_token, header, function (err, data) {
    if (err)
    {
      res.status(404);
      res.render('404', { text: 'make another call' });
      return;
    }

    //create a twitter client be able to do http request
    var client = new twitter(
    {
      consumer_key: cfg.secret.consumer_key,
      consumer_secret: cfg.secret.consumer_secret,
      access_token_key: data.oauth_token,
      access_token_secret: data.oauth_token_secret
    });

    events.auth(client);
    res.clearCookie('oauth_token');
    res.redirect(cfg.host + ':' + cfg.port + '/home');
  });

};

exports.home = function (req, res)
{
  res.render('home');
};

exports.getImage = function (req, res)
{
  events.image(req.body.tag, function (data)
    {
      res.json(data);
    });
};

exports.getQuote = function (req, res)
{
  events.quote(function (data)
    {
      res.json(data);
    });
};
