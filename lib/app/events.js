var db = require('_/db');
var cfg = require('_/cfg');
var log = require('_/log');
var oauth = require('_/oauth');
var tweet = require('_/tweet');
var forismatic = require('forismatic-node')();
var randomjs = require("random-js");
var async = require('async');

var rand = new randomjs(randomjs.engines.mt19937().autoSeed());

db.init(cfg.orion.url, cfg.orion.port, cfg.orion.version);

exports.image = function (callback)
{
  // get random tag
  var rand_tag = rand.integer(0, cfg.tags.length);

  var entity  = { type: 'HubbleImage' };
  var query   = { q: 'tag == ' + cfg.tags[rand_tag] };

  db.get(entity, query, function (context)
  {
    // choose random element from db result
    var rand_el = rand.integer(0, context.length);
  
    callback({
      src: context[rand_el].src,
      alt: context[rand_el].title
    });
  });
};

exports.quote = function (callback)
{
  // fetch request from forismatic API
  forismatic.getQuote(function (err, body)
  {
    if (!err)
    {
      callback({
        text:    body.quoteText,
        author:  body.quoteAuthor,
        link:    body.quoteLink
      });
    }
    else
    {
      log.error('quote event handler: %s', err);
      callback(err);
    }
  });
};

exports.tweet = function (data, callback)
{
  data.url = cfg.twitter.request_access_token;
  async.waterfall([
    async.apply((obj, cb) => { cb(null, obj); }, data),
    oauth.getAccessToken,
    tweet.mediaUpload,
    tweet.postTweet,
  ],
  function (err)
  {
    callback(err ? err : '');
  });
};
