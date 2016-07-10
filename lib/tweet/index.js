var log = require('_/log');

/*
 * Create a valid status with or within media content
 * client is a twitter object
 * data.url is image link and data.text is a quote
 */
exports.mediaUpload = function (req, data, callback)
{
  //create a twitter client be able to do http request
  var client = new require('twitter')({
    consumer_key: "consumer_key",
    consumer_secret: "consumer_secret",
    access_token_key: data.oauth_token,
    access_token_secret: data.oauth_token_secret
  });

  require('download')(data.url).then(image => {

  	client.post('media/upload', { media:image }, function(error, media, res)
  	{
  		var status = { status: data.text };
      if (!error) {
        status.media_ids = media.media_id_string;
      }
      else 
      {
        log.error('unable to upload media');
        callback(error);
      }
      
      callback(null, client, status);
    });
  });
}

/*
 * Post a tweet like status info
 */
exports.postTweet = function (client, status, callback)
{
  client.post('statuses/update', status,  function(error, tweet, res)
  {
    if (error)
    {
      log.error('cannot post tweet');
      callback(error);
		}
		callback(null);
	});
}
