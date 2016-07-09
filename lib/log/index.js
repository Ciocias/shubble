var cfg = require('_/cfg');
var winston = require('winston');

var defaults = {
  levels: { error: 0, info: 1, debug: 2 },
  colors: { error: 'red', info: 'green', debug: 'cyan' },
  transports: [ 
    new (winston.transports.Console) ({ level: 'debug', colorize: true })
  ];
};

var log = new ( winston.Logger ) (
{
  levels: cfg.log.levels || defaults.levels,

  colors: cfg.log.colors || defaults.colors,

  transports: [

    new (winston.transports.Console)
    ({ 
      level: cfg.log.console.level,
      colorize: true
    }),
    new (winston.transports.File)
    ({ 
      level: cfg.log.error.level,
      name: cfg.log.error.name,
      filename: cfg.log.error.file
    }),
    new (winston.transports.File)
    ({ 
      level: cfg.log.info.level,
      name: cfg.log.error.name,
      filename: cfg.log.error.file
    }),
    new (winston.transports.File)
    ({ 
      level: cfg.log.debug.level,
      name: cfg.log.error.name,
      filename: cfg.log.error.file
    })

  ] || defaults.transports;

});

// make winston aware of custom colors
winston.addColors(cfg.log.colors);

module.exports = log;
