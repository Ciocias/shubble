var Orion = require('fiware-orion-client');

module.exports =
{
  client: undefined,

  init: function (url, port, version)
  {
    this.client = new Orion.Client({ url: url + ':' + port + '/' + version });
  },

  create: function (entity, params, callback, error_callback)
  {
    this.client.registerContext(entity, params).then(callback, error_callback);
  },

  set: function (data, callback, error_callback)
  {
    this.client.updateContext(data, { updateContext: 'APPEND' }).then(callback, error_callback);
  },

  get: function (entity, options, callback, error_callback)
  {
    this.client.queryContext(entity, options).then(callback, error_callback);
  }
};
