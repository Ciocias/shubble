module.exports = function (grunt)
{
  // grunt config object
  var config = {
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
  };

  grunt.initConfig(config);

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask( 'default', [ 'jshint', 'mongo-start', 'orion-start' ]);

  // custom tasks
  grunt.registerTask( 'develop',
    'Run through nodemon, manual docker cleanup needed',
    [ 'jshint', 'mongo-start', 'orion-start', 'nodemon' ]
  );

  grunt.registerTask( 'kill',
    'Kill docker containers',
    [ 'orion-kill', 'mongo-kill' ]
  );

  grunt.registerTask( 'remove',
    'Remove docker containers',
    [ 'orion-remove', 'mongo-remove' ]
  );
};
