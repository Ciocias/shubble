var fs = require('fs');
var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('orion-start', 'Start orion docker container', function ()
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
          'start',
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