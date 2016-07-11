var express  = require('express');
var ctrl     = require('./controller.js');

// Routes definitions
var router   = express.Router();

router.get('/', ctrl.index);
router.get('/auth', ctrl.auth);
router.get('/callback', ctrl.callback);
router.get('/home', ctrl.home);

// API Routes definitions
var api_router   = express.Router();

api_router.get('/image', ctrl.getImage);
api_router.get('/quote', ctrl.getQuote);

module.exports = { router: router, api_router: api_router };
