var db = require('_/db');
var cfg = require('_/cfg');
var log = require('_/log');
var tweet = require('_/tweet');
var forismatic = require('forismatic-node')();
var randomjs = require("random-js");
var async = require('async');

var rand = new randomjs(randomjs.engines.mt19937().autoSeed());

db.init(cfg.orion.url, cfg.orion.port, cfg.orion.version);

exports.image = function (tag, callback)
{
  var entity  = { type: 'HubbleImage' };
  var query   = null;
  
  if (cfg.tags.includes(tag)) {
    query   = { q: 'tag == ' + tag };
  }
  else
  {
    // get random tag
    var rand_tag = rand.integer(0, cfg.tags.length);
    query   = { q: 'tag == ' + cfg.tags[rand_tag] };    
  }

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

exports.auth = function (client) {

  exports.name = function (callback) {
    return getName(client, callback);
  };

  exports.tweet = function (data, callback) {
    return initTweet(client, data, callback);
  };
};

//exports.setName = function (name) {
//  exports.getName = function (callback) {
//    return (name, cb) =>  
//    callback(name);
//  };
//};

function getName (client, callback) {

  async.waterfall([
    async.apply((c, cb) => { cb(null, c); }, client),
    tweet.credentials,
  ],
  function (err, res) 
  {
    callback(err ? err : res);
  });
}

function initTweet (client, data, callback) {
  
  async.waterfall([
    async.apply((c, d, cb) => { cb(null, c, d); }, client, data),
    tweet.mediaUpload,
    tweet.postTweet,
  ],
  function (err)
  {
    callback(err ? err : '');
  });
}
