var log = require('_/log');
var cfg = require('_/cfg');

var forismatic = require('forismatic-node')();
var async = require('async');

exports.index = function (req, res)
{
  res.render('index');
}

exports.home = function (req, res)
{
  // TODO: fill in
}
