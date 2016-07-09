var qs = require('querystring');

var DEBUG = true;

/*
 * Obtain a token from app credencial
 */
exports.getToken = function (url, header, callback) {
	
	require('request').post({url:url, oauth:header}, function(err, res, body) {
		
		if (res.statusCode != 200)
			res.redirect('http://127.0.0.1:4242/error');


		if (qs.parse(body).oauth_callback_confirmed != "true")
			res.redirect('http://127.0.0.1:4242/error');


		if(DEBUG){
			var data = qs.parse(body);
			console.log("oauth_token: " + data.oauth_token);
			console.log("oauth_token_secret: " + data.oauth_token_secret);
		}

		callback(qs.parse(body));
	});
}

/*
 * Obtain an access token from token and verifier
 */
exports.getAccessToken = function (url, header, callback) {

	require('request').post({url:url, oauth:header}, function(err, res, body){

		if (res.statusCode != 200)
		res.redirect('http://127.0.0.1:4242/error');
		
		if (DEBUG){
			var data = qs.parse(body);
			console.log("access_oauth_token: " + data.oauth_token);
			console.log("access_oauth_token_secret: " + data.oauth_token_secret);
			console.log("screen_name: " + data.screen_name);
			console.log("user_id: " + data.user_id);
		}

		callback(qs.parse(body));
	});
}