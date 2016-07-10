var db = require('_/db');
var log = require('_/log');
var cfg = require('_/cfg');

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
        log.error('processing route home: %s', err);        
        res.sendStatus(404); // TODO: .render('404');
      }
    });
}
