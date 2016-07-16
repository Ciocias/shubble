var fs = require('fs');
var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('orion-stop', 'Stop orion docker container', function ()
  {
    // Tells grunt that we're an async task
    var done = this.async();

    var out = fs.createWriteStream('orion.out');

    out.on('error', done);
    out.on('open', function()
    {
      var child = cp.spawn(
        'docker',
        [
          'stop',
          'orion'
        ],
        {
          detached: true,
          stdio: [out, out]
        }).unref();
      done();
    });
  });
};