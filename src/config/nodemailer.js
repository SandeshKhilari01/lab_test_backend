// Previous Gmail OAuth integration (commented out due to redirect_uri_mismatch error)
// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );
// if (process.env.REFRESH_TOKEN) {
//   oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
// }

// const createTransporter = async () => {
//   // Prefer OAuth2 if credentials are present; otherwise fallback to user/pass
//   const hasOAuth2 = Boolean(
//     process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.REFRESH_TOKEN
//   );

//   if (hasOAuth2) {
//     const accessToken = await oauth2Client.getAccessToken();
//     return nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: process.env.EMAIL_USER,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken && accessToken.token ? accessToken.token : undefined
//       }
//     });
//   }

//   return nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     },
//     tls: { rejectUnauthorized: false }
//   });
// };

// New SendGrid integration
const sgMail = require('@sendgrid/mail');

// Validate SendGrid API key
// if (!process.env.SENDGRID_API_KEY) {
//   console.error('SENDGRID_API_KEY environment variable is not set');
//   throw new Error('SENDGRID_API_KEY is required for email functionality');
// }

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.setDataResidency('eu'); 
// uncomment the above line if you are sending mail using a regional EU subuser

const emailConfig = {
  // SendGrid mail service
  sgMail: sgMail,
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Lab Test Confirmation',
    address: "troupetech9@gmail.com"
  }
};

module.exports = emailConfig;