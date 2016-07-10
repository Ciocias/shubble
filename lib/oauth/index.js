var qs = require('querystring');

var log = require('_/log');

/*
 * Obtain a token from app credential
 */
exports.getToken = function (url, header, callback) {
	
	require('request').post({url:url, oauth:header}, function(err, res, body) {
		
		if (err)
		{
			log.error('http request error: %s', err);
			callback(err, null);
		}
		if (res.statusCode != 200)
		{
			log.error('http request error: %s', err);
			callback(new Error('http request error'));
		}

		var data = qs.parse(body);
		
		if(!data.oauth_callback_confirmed)
		{
			log.error('oauth callback not confirmed');
			callback(new Error('oauth callback not confirmed'));
		}

		callback(null, data);
	});
}

/*
 * Obtain an access token from token and verifier
 */
exports.getAccessToken = function (req, callback) {
	
	var url = 'https://api.twitter.com/oauth/access_token';
  
  var header = {
    token: req.cookies.oauth_token,
    verifier: req.cookies.oauth_verifier
  };

	require('request').post({url:url, oauth:header}, function(err, res, body){

		if (err || res.statusCode != 200) {
			log.error('http request error: %s', err);
			callback(err);
		}
		
		var data = qs.parse(body);

		log.debug("access_oauth_token: %s", data.oauth_token);
		log.debug("access_oauth_token_secret: %s", data.oauth_token_secret);
		log.debug("screen_name: %s", data.screen_name);
		log.debug("user_id: %s", data.user_id);

		callback(null, req, data);
	});
}
