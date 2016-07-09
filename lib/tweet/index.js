/*
 * Create a valid status with or within media content
 */
exports.mediaUpload = function (client, data, callback) {
	if (data.tweet_picture != ''){
		var img = require('fs').readFileSync(data.tweet_picture);
			client.post('media/upload', {media:img}, function(error, media, response) {
				if (!error) {
					var status = {
						status: data.tweet_text,
						media_ids: media.media_id_string
					};

					callback(status);
				}
			});
	} else {
		callback({status: data.tweet_text});
	}
}

/*
 * Post a tweet like status info
 */
exports.postTweet = function (client, status, callback) {
	client.post('statuses/update', status,  function(error, tweet, response) {
		if(error) throw error;
		callback();
	});
}