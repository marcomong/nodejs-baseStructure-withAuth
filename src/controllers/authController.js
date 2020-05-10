const log = require('../loaders/logger')
const AuthService = require('../services/AuthService')
const UserModel = require('../models/User')
const Response = require('../models/Response')

const signUp = async (req, res) => {
  const { body } = req;
  log.debug(`signing up user with email ${body.email}`)

  try {
    const service = new AuthService(UserModel)
    const result = await service.SignUp(body.name, body.lastName, body.email, body.password)
    
    if(result.succeeded) {
      res.status(200).send(result)
    } else {
      res.status(500).send(result)
    }
  } catch (err) {
    log.error('%o', err)
    res.status(500).send(new Response().Failed(-1, 'An error has accourred. Please try again'))
  }
}

const signIn = async (req, res) => {
  const { body } = req;
  log.debug(`signing In user with email ${body.email}`)

  try {
    const service = new AuthService(UserModel)
    const result = await service.SignIn(body.email, body.password)
    
    if(result.succeeded) {
      res.status(200).send(result)
    } else {
      if(result.errorCode == 2 || result.errorCode == 3) { // error code 2 = user does not exists. errorCode = 3 password is wrong
        res.status(401).send(result)
      } else {
        res.status(500).send(result)
      }
    }
  } catch (err) {
    log.error('%o', err)
    res.status(500).send(new Response().Failed(-1, 'An error has accourred. Please try again'))
  }
}

const validateToken = async (req, res) => {
  if (!req.body || !req.headers.authorization || req.headers.authorization.trim() == '') {
    return new Response().Failed(-2, 'Token not present')
  }

  try {
    const token = req.body.refreshToken && req.body._id ? req.body.refreshToken : req.headers.authorization
    const service = new AuthService(UserModel)
    const result = await service.ValidateToken(token)
    return result
  } catch (err) {
    log.error('%o', err)
    return new Response().Failed(-2, 'User unauthorized')
  }
}

const refreshToken = async (req, res) => {
  const _id = req.body._id

  try {
    const service = new AuthService(UserModel)
    const token = await service.RefreshToken(_id)

    if (token.succeeded) {
      res.status(200).send(token)
    } else {
      res.status(401).send(new Response().Failed(-2, 'User unauthorized'))
    }
  } catch (err) {
    log.error('%o', err)
    res.status(401).send(new Response().Failed(-2, 'User unauthorized'))
  }
}

module.exports.signUp = signUp;
module.exports.signIn = signIn;
module.exports.validateToken = validateToken;
module.exports.refreshToken = refreshToken;
