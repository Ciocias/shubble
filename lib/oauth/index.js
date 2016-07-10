var log = require('_/log');
var qs = require('querystring');
var request = require('request');

/*
 * Obtain a token from app credential
 */
exports.getToken = function (url, header, callback)
{
	request.post({ url: url, oauth: header }, function(err, res, body)
	{	
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
exports.getAccessToken = function (data, callback)
{	
	var url = 'https://api.twitter.com/oauth/access_token';
  
  var header = {
    token: data.cookies.oauth_token,
    verifier: data.cookies.oauth_verifier
  };

	request.post({ url: url, oauth: header }, function(err, res, body)
	{
		if (err || res.statusCode != 200)
		{
			log.error('http request error: %s', err);
			callback(err);
		}

		callback(null, data, qs.parse(body));
	});
}
