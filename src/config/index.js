module.exports = {
  port: parseInt(process.env.PORT, 10) || 8081,
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  auth: {
    secret: process.env.JWT_SECRET || 'thisIsMySecret',
  },
  nodemailer: {
    user: process.env.MAIL_USER || '',
    clientId: process.env.MAIL_CLIENTID || '',
    clientSecret: process.env.MAIL_SECRET || '',
    refreshToken: process.env.MAIL_REFRESH_TOKEN || '',
    accessToken: process.env.MAIL_ACC_TOKEN || ''
  },
  databaseURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/database'
}