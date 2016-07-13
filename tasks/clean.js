var fs = require('fs');
var glob = require('glob');
var path = require('path');

function delete_all (err, list)
{
  if (err)
  {
    console.log('glob:delete_all: ' + err);
    return;
  }

  Object.keys(list).map(function (el)
  {
    fs.unlink(path.resolve(__dirname + '/../' + list[el]), function ()
    {
      console.log('Deleted: ' + list[el]);
    });
  });
}

module.exports = function (grunt)
{
  grunt.registerTask('clean', 'Delete logs and output files', function ()
  {
    // Tells grunt that we're an async task
    var done = this.async();

    glob('*.log', null, delete_all);

    glob('*.out', null, delete_all);
  });
};