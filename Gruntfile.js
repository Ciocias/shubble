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
        './bin/*.js',
        './tasks/*.js',
        './lib/*/*.js'
      ]
    },

    nodemon: { script: '.' }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', [ 'jshint', 'mongo-start', 'orion-start' ]);
  grunt.registerTask('develop', [ 'jshint', 'mongo-start', 'orion-start', 'nodemon' ]);
  grunt.registerTask('kill', [ 'orion-kill', 'mongo-kill' ]);
  grunt.registerTask('remove', [ 'orion-remove', 'mongo-remove' ]);
};
