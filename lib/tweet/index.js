var log = require('_/log');
var cfg = require('_/cfg');

var download = require('download');

/*
 * Create a valid status with or within media content
 * client is a twitter object
 * data.url is image link and data.text is a quote
 */
exports.mediaUpload = function (client, data, callback)
{

  download(data.link).then(image => {

  	client.post('media/upload', { media: image }, function(error, media, res)
  	{
  		var tweet = { status: data.quote.text + ' - ' + data.quote.author + cfg.twitter.hashtag };
      if (!error) {
        tweet.media_ids = media.media_id_string;
      }
      else 
      {
        log.error('unable to upload media');
        callback(error);
      }
      
      callback(null, client, tweet);
    });
  });
};

/*
 * Post a tweet like status info
 */
exports.postTweet = function (client, data, callback)
{
  client.post('statuses/update', data,  function(error, tweet, res)
  {
    callback(error ? error : null);
  });
};

/*
 * Get account credentials
 */
exports.credentials = function (client, callback)
{
  client.get('account/verify_credentials',  function(error, tweet, res)
  {
    callback(error, { name: tweet.name, screen_name: tweet.screen_name });
  });
};
