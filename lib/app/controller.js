var log = require('_/log');
var cfg = require('_/cfg');
var oauth = require('_/oauth');

var async = require('async');

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

  oauth.getToken('https://api.twitter.com/oauth/request_token', header, function(err, data)
  {
    if (err)
      log.error(err);

    res.cookie('oauth_token', data.oauth_token, { maxAge: 900000, httpOnly: false });
    res.redirect('https://api.twitter.com/oauth/authenticate' + '?' + 'oauth_token=' + data.oauth_token);
  });
};

exports.callback = function(req, res)
{
  //twitter dice di vedere se sono uguali
  if(req.cookies.oauth_token != req.query.oauth_token)
  {
    res.status(404);
    res.render('404', { text: 'make another call' });     
  }

  res.cookie('oauth_verifier', req.query.oauth_verifier, { maxAge: 900000, httpOnly: false });
  res.redirect(cfg.host + ':' + cfg.port + '/home');
};

exports.home = function (req, res)
{
  res.render('home');
};
