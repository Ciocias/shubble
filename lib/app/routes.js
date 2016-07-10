var express  = require('express');
var ctrl     = require('./controller.js');

var router   = express.Router();

// Routes definitions

// GET
router.get('/', ctrl.index);
router.get('/auth', ctrl.auth);
router.get('/callback', ctrl.callback);
router.get('/home', ctrl.home);

module.exports = router;
