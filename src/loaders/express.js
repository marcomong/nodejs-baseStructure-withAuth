const bodyParser = require('body-parser');
const cors = require('cors');
const apis = require('../apis')
const Response = require('../models/Response')
const log = require('./logger')

module.exports = ({ app }) => {

  app.enable('trust proxy');
  app.use(cors());
  app.use(bodyParser.json({
    limit: '10mb'
  }))

  app.use(bodyParser.urlencoded({
    extended: false,
    limit: '10mb'
  }))

  app.use('/api', apis())

  app.use((error, req, res, next) => {
    if (error.joi) {
      const result = new Response().Failed(5, error.joi.message)
      return res.status(422).send(result);
    }
  
    return res.status(500).send(error)
  });
}