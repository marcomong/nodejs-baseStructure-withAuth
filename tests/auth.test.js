const express = require('express');
const app = express();
const request = require('supertest')
const User = require('../src/models/User')

const userOne = {
  name: 'userName',
  lastName: 'userLastName',
  email: 'test@gmail.com',
  password: 'AB1@123123abc'
}

const userTwo = {
  name: 'userName',
  lastName: 'userLastName',
  email: 'testUserTwo@gmail.com',
  password: 'AB1@123123abc'
}

beforeAll(async () => {
  await require('../src/loaders')({ expressApp: app});
  await User.deleteMany().exec()

  // saving user for login test
  const user = new User(userTwo)
  user.setPassword(userTwo.password)
  await user.save()
});

beforeEach(async () => {
  await User.deleteOne({email: userOne.email}).exec()
})

describe('POST /auth/signUp', function () {
  it('POSITIVE - signUp', async function(done) {
    const res = await request(app)
      .post('/api/auth/signUp')
      .send(userOne)
    
    // checking body response and status
    const body = res.body.body
    expect(res.status).toBe(200)
    expect(res.body.succeeded).toBeTruthy()
    expect(body.email).toBe(userOne.email)
    expect(body.name).toBe(userOne.name)
    expect(body.lastName).toBe(userOne.lastName)
    expect(body.password).toBeUndefined()
    expect(body.hash).toBeUndefined()
    expect(body.token).not.toBeNull()

    // checking if the user exists in the database
    const user = await User.findOne({email: userOne.email}).exec()
    expect(user).not.toBeNull()
    done()
  });


  it('NEGATIVE - signUp with wrong Password', async function(done) {
    const userUpdated = { ...userOne }
    userUpdated.email = 'wrongEmail'

    const res = await request(app)
      .post('/api/auth/signUp')
      .send(userUpdated)
    
    // checking body response and status
    expect(res.status).toBe(422)
    expect(res.body.succeeded).toBeFalsy()
    expect(res.body.errorCode).toBe(5)
    expect(res.body.message).toBe('Email is not valid')
    expect(res.body.body).toBeUndefined()

    // checking if the user exists in the database
    const user = await User.findOne({email: userUpdated.email}).exec()
    expect(user).toBeNull()
    done() 
  })

  it('NEGATIVE - signUp with wrong Email', async function(done) {
    const userUpdated = { ...userOne }
    userUpdated.password = 'abc'

    const res = await request(app)
      .post('/api/auth/signUp')
      .send(userUpdated)
    
    // checking body response and status
    expect(res.status).toBe(422)
    expect(res.body.succeeded).toBeFalsy()
    expect(res.body.errorCode).toBe(5)
    expect(res.body.message).toBe('Password is not valid')
    expect(res.body.body).toBeUndefined()

    // checking if the user exists in the database
    const user = await User.findOne({email: userUpdated.email}).exec()
    expect(user).toBeNull()
    done() 
  })

  it('NEGATIVE - signUp with wrong Name', async function(done) {
    const userUpdated = { ...userOne }
    userUpdated.name = ' ' // empty value

    const res = await request(app)
      .post('/api/auth/signUp')
      .send(userUpdated)
    
    // checking body response and status
    expect(res.status).toBe(422)
    expect(res.body.succeeded).toBeFalsy()
    expect(res.body.errorCode).toBe(5)
    expect(res.body.message).toBe('Name is not valid')
    expect(res.body.body).toBeUndefined()

    // checking if the user exists in the database
    const user = await User.findOne({email: userUpdated.email}).exec()
    expect(user).toBeNull()
    done() 
  })

  it('NEGATIVE - signUp with wrong Last Name', async function(done) {
    const userUpdated = { ...userOne }
    userUpdated.lastName = ' ' // empty value

    const res = await request(app)
      .post('/api/auth/signUp')
      .send(userUpdated)
    
    // checking body response and status
    expect(res.status).toBe(422)
    expect(res.body.succeeded).toBeFalsy()
    expect(res.body.errorCode).toBe(5)
    expect(res.body.message).toBe('Last Name is not valid')
    expect(res.body.body).toBeUndefined()

    // checking if the user exists in the database
    const user = await User.findOne({email: userUpdated.email}).exec()
    expect(user).toBeNull()
    done() 
  })
});


describe('POST /auth/signIn', function () {
  it('POSITIVE - signIn', async function(done) {
    const res = await request(app)
      .post('/api/auth/signIn')
      .send({
        email: userTwo.email,
        password: userTwo.password
      })
    
    // checking body response and status
    const body = res.body.body
    expect(res.status).toBe(200)
    expect(res.body.succeeded).toBeTruthy()
    expect(body.email).toBe(userTwo.email)
    expect(body.name).toBe(userTwo.name)
    expect(body.lastName).toBe(userTwo.lastName)
    expect(body.password).toBeUndefined()
    expect(body.hash).toBeUndefined()
    expect(body.token).not.toBeNull()

    done()
  });

  it('NEGATIVE - signIn with wrong password', async function(done) {
    const res = await request(app)
      .post('/api/auth/signIn')
      .send({
        email: userTwo.email,
        password: userTwo.password + 'a'
      })
    
    // checking body response and status
    const body = res.body.body
    expect(res.status).toBe(401)
    expect(res.body.succeeded).toBeFalsy()
    expect(res.body.errorCode).toBe(3)
    expect(res.body.message).toBe('Password/Email are not matching')
    expect(res.body.body).toBeUndefined()

    done()
  });

  it('NEGATIVE - signIn with wrong email', async function(done) {
    const res = await request(app)
      .post('/api/auth/signIn')
      .send({
        email: userTwo.email + 'a',
        password: userTwo.password
      })
    
    // checking body response and status
    const body = res.body.body
    expect(res.status).toBe(401)
    expect(res.body.succeeded).toBeFalsy()
    expect(res.body.errorCode).toBe(2)
    expect(res.body.message).toBe('User does not exists')
    expect(res.body.body).toBeUndefined()

    done()
  });

});


