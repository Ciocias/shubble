var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('orion-remove', 'Remove orion docker container', function ()
  {
    cp.spawn(
      'docker',
      [ 'rm', 'orion' ],
      {
        detached: true,
        stdio: 'inherit'
      }
    ).on('exit', this.async());
  });
};
