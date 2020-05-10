const winston = require('winston');
const config = require('../config');
const path = require('path')
const logDir = path.join(__dirname, '../../logs')

const transports = [];
transports.push(
  new winston.transports.File({
    filename: path.join(logDir, path.join(getFormattedDate())),
    level: 'debug',
    prettyPrint: true,
    format: winston.format.printf(info => `${new Date().toISOString()}, ${info.message}`),
    json: false
  }
  ))
if (process.env.NODE_ENV == 'production') {
  transports.push(
    new winston.transports.Console()
  )
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
      )
    })
  )
}

function getFormattedDate() {
  var date = new Date()

  var year = date.getFullYear()

  var month = (1 + date.getMonth()).toString()
  month = month.length > 1 ? month : '0' + month

  var day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return month + '-' + day + '-' + year + '.log'
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

module.exports = LoggerInstance;