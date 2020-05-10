const express = require('express');
const config = require('./config/index');
const logger = require('./loaders/logger');

const app = express();

async function startServer() {
  await require('./loaders')({ expressApp: app});

  app.listen(config.port, err => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`
      ####################################
         Server listening on port: ${config.port}
      ####################################
    `);
  })
}

startServer();

module.exports = app
