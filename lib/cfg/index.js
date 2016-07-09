var resolve = require('path').resolve;

// check whether an environment variable has been set
var env = process.env.NODE_ENV || 'development';

// environment settings
var cfg = require('./env/' + env);
cfg.env = env;

// express settings
cfg.pub_dir = resolve(__dirname, '../../public');
cfg.view_dir = resolve(__dirname, '../views');

module.exports = cfg;
