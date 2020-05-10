const mongoose = require('mongoose')
const log = require('../loaders/logger')
const crypto = require('crypto')
const config = require('../config')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  salt: {
    type: String
  },
  hash: {
    type: String
  }
})

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.isValidPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

UserSchema.methods.generateJWT = function (isRefreshToken = false) {
  const expirationTime = isRefreshToken ? {} : {expiresIn: '10m'}
  return jwt.sign({
    email: this.email,
    _id: this._id
  }, config.auth.secret, expirationTime)
}

UserSchema.methods.toJSON = function () {
  return {
    email: this.email,
    name: this.name,
    lastName: this.lastName,
    token: this.token ? this.token : '',
    refreshToken: this.refreshToken ? this.refreshToken : '',
    _id: this._id,
  }
}

const User = module.exports = mongoose.model('User', UserSchema)

const findUser = async (name, lastName, email) => {
  // checks for email or (name and last name)
  // const query = { $or: [
  //   { email },
  //   { $and: [
  //     { name }, { lastName }
  //   ]}
  // ]}

  // checking just for the email
  const query = { email }
  
  try {
    const result = await User.findOne(query).exec()
    return result;
  } catch (err) {
    const error = `Error while retrieving user with info name: ${name}, lastName ${lastName}, email: ${email}`
    log.error('%o', err)
    throw error
  }
}

module.exports.findUser = findUser;