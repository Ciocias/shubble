var cp = require('child_process');

module.exports = function (grunt)
{
  grunt.registerTask('mongo-remove', function ()
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
