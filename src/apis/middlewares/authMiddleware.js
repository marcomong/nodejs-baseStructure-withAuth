const controller = require('../../controllers/authController')

const validateToken = async (req, res, next) => {
  const isTokenValid = await controller.validateToken(req, res)
  if (isTokenValid.succeeded) {
    next()
  } else {
    res.status(401).send(isTokenValid)
  }
}

module.exports.validateToken = validateToken;
