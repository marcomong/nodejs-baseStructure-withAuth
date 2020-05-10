const { Router } = require('express')
const controller = require('../../controllers/authController')
const route = Router();
const { celebrate, Joi } = require('celebrate')
const authValidator = require('../validators/authValidator')
const authMiddleware = require('../middlewares/authMiddleware')

const signUpSchema = {
  body: {
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }
};

const signInSchema = {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    }
  };

module.exports = (app) => {
  app.use('/auth', route)
  
  route.post('/signUp', celebrate(signUpSchema), authValidator.signUp, controller.signUp)
  route.post('/signIn', celebrate(signInSchema), authValidator.signIn, controller.signIn)
  route.post('/refreshToken', authMiddleware.validateToken, controller.refreshToken)
}
