var qs = require('querystring');

var log = require('_/log');

/*
 * Obtain a token from app credencial
 */
exports.getToken = function (url, header, callback) {
	
	require('request').post({url:url, oauth:header}, function(err, res, body) {
		
		if (err)
		{
			log.error('http request error: %s', err);
			callback(err, null);
		}

		if (data.oauth_callback_confirmed && res.statusCode == 200){
			var data = qs.parse(body);


			log.debug("oauth_token: %s", data.oauth_token);
			log.debug("oauth_token_secret: %s", data.oauth_token_secret);

			callback(null, data);
		}
		callback(new Error('oauth callback not confirmed or status code different 200'), null);
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
