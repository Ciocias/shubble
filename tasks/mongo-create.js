var fs = require('fs');
var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('mongo-create', 'Create a mongo docker container', function ()
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
          'run',
          '-d',
          '--name', 'mongo',
          'mongo:2.6',
          '--smallfiles',
          '--nojournal'
        ],
        {
          detached: true,
          stdio: [out, out]
        }).unref();
      done();
    });
  });
};