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
			callback(err, null);

		if (res.statusCode != 200)
		{
			callback('getToken status ' + res.statusCode, null);
			return;
		}

		var data = qs.parse(body);
		
		if(!data.oauth_callback_confirmed)
		{
			callback('oauth callback not confirmed', null);
			return;
		}

		callback(null, data);
	});
};

/*
 * Obtain an access token from token and verifier
 */
exports.getAccessToken = function (url, header, callback)
{	  

	request.post({ url: url, oauth: header }, function(err, res, body)
	{
		if (err)
			callback(err);

		if (res.statusCode != 200)
			callback(new Error(res.statusCode));
		else
			callback(null, qs.parse(body));
	});
};
