const validator = require('validator')
const Response = require('../../models/Response')
const unporcessableEntityStatus = 422
const passwordRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'

const signUp = function (req, res, next) {
  const { body } = req
  trimPayload(body)
  
  if(!validator.isEmail(body.email))
    return res.status(unporcessableEntityStatus).send(new Response().Failed(5, 'Email is not valid'))

  if(validator.isEmpty(body.name))
    return res.status(unporcessableEntityStatus).send(new Response().Failed(5, 'Name is not valid'))

  if(validator.isEmpty(body.lastName))
    return res.status(unporcessableEntityStatus).send(new Response().Failed(5, 'Last Name is not valid'))

  if(validator.isEmpty(body.password) || !body.password.match(passwordRegex))
    return res.status(unporcessableEntityStatus).send(new Response().Failed(5, 'Password is not valid'))

  next()
}

const signIn = function (req, res, next) {
  const { body } = req
  trimPayload(body)

  if(!validator.isEmail(body.email))
    return res.status(unporcessableEntityStatus).send(new Response().Failed(5, 'Email is not valid'))

  if(validator.isEmpty(body.password) || !body.password.match(passwordRegex))
    return res.status(unporcessableEntityStatus).send(new Response().Failed(5, 'Password is not valid'))

  next()
}

const trimPayload = function (body) {
  for(let property in body) {
    body[property] = body[property].trim()
  }
  return
}

module.exports.signIn = signIn
module.exports.signUp = signUp