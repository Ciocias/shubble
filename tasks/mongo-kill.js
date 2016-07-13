var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('mongo-kill', function ()
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
