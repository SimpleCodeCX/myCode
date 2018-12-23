const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: log4js.levels.ALL
    }
  }
});

module.exports = function (category) {
  return log4js.getLogger(category);
}