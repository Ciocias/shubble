module.exports = function (grunt)
{
  grunt.initConfig(
  {
    pkg: grunt.file.readJSON('package.json'),

    jshint:
    {
      options: { esversion: 6 },
      myFiles:
      [
        'Gruntfile.js',
        './lib/*/*.js'
      ]
    },

    nodemon: { script: '.' }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', [ 'jshint', 'orion', 'nodemon' ]);
  grunt.registerTask('check', [ 'jshint', 'clean' ]);
};
