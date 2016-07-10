var db = require('_/db');
var log = require('_/log');
var cfg = require('_/cfg');
var oauth = require('_/oauth');

var forismatic = require('forismatic-node')();
var async = require('async');

var randomjs = require("random-js");
var rand = new randomjs(randomjs.engines.mt19937().autoSeed());

db.init(cfg.orion.url, cfg.orion.port, cfg.orion.version);

function get_random_quote (callback)
{
  forismatic.getQuote(function (err, body)
  {
    if (!err)
    {
      callback(null,
        {
          text: body.quoteText,
          author: body.quoteAuthor,
          link: body.quoteLink
        });
    }
    else
    {
      log.error('fetching quote from forismatic: %s', err);
      callback(err);
    }
  });
}

function get_random_image (quote, callback)
{
  // TODO: randomize tag && output choice
  var rand_tag = rand.integer(0, cfg.tags.length);

  var entity  = { type: 'HubbleImage' };
  var query   = { q: 'tag == ' + cfg.tags[rand_tag] };

  db.get(entity, query, function (context)
  {
    var rand_el = rand.integer(0, context.length);
  
    callback(null,
    {
      quote: quote,
      image:
      {
        src: context[rand_el].src,
        alt: context[rand_el].title
      }
    });
  });
}

exports.index = function (req, res)
{
  res.render('index');
}

exports.auth = function (req, res) {
    
  var header = {
    consumer_key: cfg.secret.consumer_key,
    consumer_secret: cfg.secret.consumer_secret,
    callback: cfg.host + ':' + cfg.port + '/callback'
  };

  oauth.getToken('https://api.twitter.com/oauth/request_token', header, function(err, data) {
    if (err) {
      log.error(err); //and?
    }

    res.cookie('oauth_token', data.oauth_token, { maxAge: 900000, httpOnly: true });
    res.redirect('https://api.twitter.com/oauth/authenticate' + '?' + 'oauth_token=' + data.oauth_token);
  });

}

exports.callback = function(req, res) {
  //twitter dice di vedere se sono uguali
  if(req.cookies.oauth_token != req.query.oauth_token)
    res.sendStatus(404);// TODO: .render('404');

  res.cookie('oauth_verifier', req.query.oauth_verifier, { maxAge: 900000, httpOnly: true });
  res.redirect(cfg.host + ':' + cfg.port + '/home');
}

exports.home = function (req, res)
{
  async.waterfall([
    get_random_quote,
    get_random_image
    ], function (err, result) {
      if (!err && result !== undefined)
      {
        res.render('home', result);
      }
      else
      {
        log.error('route /home: %s', err);

        res.status(404);
        res.render('404', { text: 'make another call' });
      }
    });
}

exports.tweet = function (req, res)
{
  res.json({ link: req.body.link, quote: req.body.quote, author: req.body.author });
}
