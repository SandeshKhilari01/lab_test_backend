const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 2525,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // your-email@gmail.com
      pass: process.env.EMAIL_PASS  // your-app-password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const emailConfig = {
  transporter: createTransporter(),
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Lab Test Confirmation',
    address: process.env.EMAIL_USER
  }
};

module.exports = emailConfig;