const Response = require('../models/Response')
const nodemailer = require('nodemailer')
const log = require('../loaders/logger')
const config = require('../config')
 
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: config.nodemailer.user,
    clientId: config.nodemailer.clientId,
    clientSecret: config.nodemailer.clientSecret,
    refreshToken: config.nodemailer.refreshToken,
    accessToken: config.nodemailer.accessToken
  }
})

class EmailService {

  async addMe (email) {
    try {
      const subject = 'New Subscriber!!!'
      const content = `this email wants to be addded in the subscriber list ${email}`

      const result = await this.sendEmail(subject, content)
      return new Response().Succeeded(result.messageId)
    } catch (err) {
      return new Response().Failed(9, `Could not add email ${email} to subscribe list`)
    }
  }

  sendEmail (subject, content) {
    return new Promise((resolve, reject) => {
      let message = {
        from: `name <${config.nodemailer.user}>`,
        to: 'emailTo@email.com',
        subject: subject,
        html: content,
      }
      transporter.sendMail(message, (err, info) => {
        if (err) {
          log.error(err)
          reject(err)
        }
        log.info('email sent')
        resolve(info)
        // transporter.close()
      })
    })
  }
}

module.exports = EmailService
