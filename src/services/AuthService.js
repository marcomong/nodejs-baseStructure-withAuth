const log = require('../loaders/logger')
const Response = require('../models/Response')
const jwt = require('jsonwebtoken')
const config = require('../config')

class AuthService {
  constructor (userModel) {
    this.User = userModel;
  }
  
  async SignUp(name, lastName, email, password) {
    const user = await this.User.findUser(name, lastName, email)
    if(!user) {
      log.debug(`this user with info name ${name}, ${lastName}, ${email} is NEW`)
      const newUser = new this.User({
        name,
        lastName,
        email
      })

      newUser.setPassword(password)
      await newUser.save()
      newUser.token = newUser.generateJWT()
      newUser.refreshToken = newUser.generateJWT(true)

      const result = newUser.toJSON()

      log.debug(`User with email ${email} saved correctly`)
      return new Response().Succeeded(result)

    } else {
      return new Response().Failed(1, 'User already exists')
    }
  }

  async SignIn (email, password) {
    const user = await this.User.findOne({email}).exec()
    if(!user) {
      log.debug(`User with email ${email} does not exists`)
      return new Response().Failed(2, 'User does not exists')
    }

    const isValidPassword = user.isValidPassword(password)
    if (isValidPassword) {
      user.token = user.generateJWT()
      user.refreshToken = user.generateJWT(true)

      const result = user.toJSON()
      return new Response().Succeeded(result)
    } else {
      return new Response().Failed(3, 'Password/Email are not matching')
    }
  }

  async ValidateToken (token) {
    try {
      let decoded = jwt.verify(token, config.auth.secret)
      return new Response().Succeeded(decoded)
    } catch (err) {
      // log.error('%o', err)
      log.error('Token expired')
      return new Response().Failed(-2, 'User unauthorized')
    }
  }

  async RefreshToken (_id) {
    if (!_id || _id.trim() == '') {
      return new Response().Failed(8, `User with _id ${_id} not found`)
    }

    const user = await this.User.findOne({_id}).exec()
    if (user) {
      const token = user.generateJWT()
      return new Response().Succeeded({token})
    } else {
      return new Response().Failed(8, `User with _id ${_id} not found`)
    }
  }

}

module.exports = AuthService
