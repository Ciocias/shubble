var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('mongo-remove', 'Remove mongo docker container', function ()
  {
    cp.spawn(
      'docker',
      [ 'rm', 'mongo' ],
      {
        detached: true,
        stdio: 'inherit'
      }
    ).on('exit', this.async());
  });
};
