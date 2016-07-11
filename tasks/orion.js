var fs = require('fs');
var child_process = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('orion', function ()
  {
    // Tells grunt that we're an async task
    var done = this.async();

    var out = fs.createWriteStream('orion.out');

    out.on('error', done);
    out.on('open', function()
    {
      var child = child_process.spawn(
        'docker-compose',
        [ 'up' ],
        {
          detached: true,
          stdio: [out, out]
        }).unref();
      done();
    });

  });
};