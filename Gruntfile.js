module.exports = function (grunt)
{
  // grunt config object
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    jshint:
    {
      options:
      {
        esversion: 6,
        forin: true,
        freeze: true,
        futurehostile: true,
        maxdepth: 2,
        noarg: true,
        nonbsp: true,
        nocomma: true,
        nonew: true,
        strict: false,
        undef: true,
        // env
        node: true
      },
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

  // register user and npm provided tasks
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  // custom tasks

  grunt.registerTask( 'setup',
    'Setup development environment',
    [ 'liblink', 'create', 'start' ]
  );

  grunt.registerTask( 'develop',
    'Check js files and start nodemon',
    [ 'jshint', 'start', 'nodemon' ]
  );

  grunt.registerTask( 'create',
    'Create docker containers',
    [ 'mongo-create', 'orion-create' ]
  );

  grunt.registerTask( 'start',
    'Start docker containers',
    [ 'mongo-start', 'orion-start' ]
  );

  grunt.registerTask( 'stop',
    'Stop docker containers',
    [ 'orion-stop', 'mongo-stop' ]
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
