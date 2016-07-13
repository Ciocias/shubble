var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('mongo-kill', 'Kill mongo docker container', function ()
  {
    cp.spawn(
      'docker',
      [ 'kill', 'mongo' ],
      {
        detached: true,
        stdio: 'inherit'
      }
    ).on('exit', this.async());
  });
};
