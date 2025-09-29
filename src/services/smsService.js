const twilio = require('twilio');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('Twilio credentials not found. SMS functionality will be disabled.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

class SmsService {
  static async sendTextMessage(toPhoneNumber, messageBody) {
    try {
      if (!client) {
        throw new Error('Twilio client not initialized. Please check your environment variables.');
      }

      const message = await client.messages.create({
        body: messageBody,
        from: twilioPhoneNumber,
        to: toPhoneNumber
      });

      return {
        success: true,
        sid: message.sid
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}

module.exports = SmsService;


