var fs = require('fs');
var path = require('path');

module.exports = function (grunt)
{
  grunt.registerTask('liblink', 'Make soft link to lib inside node_modules', function ()
  {
    var done = this.async();

    fs.symlink(
      path.resolve(__dirname + '/../lib'),
      path.resolve(__dirname + '/../node_modules/' + '_'),
      () => { done(); }
    );
  });
};