const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const Logger = require('./logger');

module.exports = async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info('Connection to the DB:\t SUCCESS!');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded:\t SUCCESS!');
}