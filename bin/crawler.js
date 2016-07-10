'use-strict';

// App modules
var db   = require('_/db');
var cfg  = require('_/cfg');
var log  = require('_/log');

// Web utils
var request  = require('request');
var cheerio  = require('cheerio');
var async    = require('async');

/* Globals */
const HUBBLE_PREFIX            = "http://hubblesite.org/gallery/album/entire";
const HUBBLE_GALLERY_SUFFIX    = "/npp/all";
const HUBBLE_IMAGE_MED_SUFFIX  = "/web/npp/all";
const HUBBLE_IMAGE_FASTFACTS   = "http://hubblesite.org/newscenter/archive/releases/";

// Get images id and title
function get_infos (callback)
{
  request (
    HUBBLE_PREFIX + HUBBLE_GALLERY_SUFFIX, 
    function (err, res, body) 
    {
      if (!err && res.statusCode === 200)
      {
        var images    = {};
        var contents  = cheerio.load(body)('div #ListBlock').children();

        var id = 0;

        contents.map (function(el) 
        {
          images[el]  = {};

          images[el].type   = 'HubbleImage';
          images[el].id     = 'Image' + (++id);

          images[el].img_id = contents[el].attribs.id;
          images[el].title  = contents[el].attribs.title;

          images[el].tag    = '';
        });

        callback(null, images);
      }
      else
      {
        log.error('get_infos: %s', err);
        callback(err);
      }
    }
  );
}

// Get images source
function get_sources (images, callback)
{
  Object.keys(images).map(function(el)
  {
    request (
      HUBBLE_PREFIX + '/' + images[el].img_id + HUBBLE_IMAGE_MED_SUFFIX, 
      function(err, res, body) 
      {
        if (!err && res.statusCode == 200)
        {
          var element = cheerio.load(body)('div .subpage-body').children()[0];

          if (element !== undefined)
          {
            images[el].src = element.attribs.src;

            get_fastfacts(images[el], function() {
              log.debug('pushed: %s', images[el].img_id);
            });
          }
        }
        else
        {
          log.error('get_sources: %s', el);
        }
      }
    );
  });

  callback(null);
}

// tag an image based on str
function tag_image (img, str) 
{
  Object.keys(cfg.tags).map(function(tag) 
  {
    if (str.includes(cfg.tags[tag]))
    {
      img.tag = cfg.tags[tag];
    }
  });

  if (img.tag === '' || img.tag === undefined)
  {
    img.tag = 'unknown';
  }
}

// get image description to tag it
function get_fastfacts (el, callback)
{
  // parse url info from id
  var year = el.img_id.substring(2, 6);
  var rel = el.img_id.substring(7, el.img_id.length-1);

  request(HUBBLE_IMAGE_FASTFACTS + year + '/' + rel + '/fastfacts/', 
    function(err, res, body) 
    {
      if (!err && res.statusCode === 200)
      {
        var aux = cheerio.load(body)('table').find('td').text();

        if (aux.includes('Object Description'))
        {
          tag_image(el, aux.split('Object Description')[1].substring(1, 100).trim());
          db.set(el, callback);
        }
      }
      else
      {
        log.error('get_fastfacts: [%s] %s', el.img_id, err);
      }
    });
}

// Get hubble images
function fetch_data ()
{
  async.waterfall(
    [
      get_infos,
      get_sources
    ], 
    function(err) 
    {
      if (!err)
      {
        log.info('pushing data to database...');
      }
      else
      {
        log.error('fetch_data: %s', err);
      }
    }
  );
}

/* Main routine */
(function() 
{
  log.info('===================');
  log.info('=     crawler     =');
  log.info('===================');

  log.info("simple hubble images fetcher\n");

  db.init(cfg.orion.url, cfg.orion.port, cfg.orion.version);

  fetch_data();
})();
