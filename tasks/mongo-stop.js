var fs = require('fs');
var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('mongo-stop', 'Stop mongo docker container', function ()
  {
    // Tells grunt that we're an async task
    var done = this.async();

    var out = fs.createWriteStream('mongo.out');

    out.on('error', done);
    out.on('open', function()
    {
      var child = cp.spawn(
        'docker',
        [
          'stop',
          'mongo'
        ],
        {
          detached: true,
          stdio: [out, out]
        }).unref();
      done();
    });
  });
};