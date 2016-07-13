var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('orion-kill', function ()
  {
    cp.spawn(
      'docker',
      [ 'kill', 'orion' ],
      {
        detached: true,
        stdio: 'inherit'
      }
    ).on('exit', this.async());
  });
};
