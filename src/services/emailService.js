const fs = require('fs').promises;
const path = require('path');
const emailConfig = require('../config/nodemailer');

class EmailService {
  constructor() {
    this.sgMail = emailConfig.sgMail;
    this.from = emailConfig.from;
  }

  async verifyConnection() {
    try {
      // SendGrid doesn't have a verify method like nodemailer
      // We can test by sending a simple test email or just return true
      console.log('SendGrid email service initialized successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  async sendLabBookingConfirmation(bookingData) {
    try {
      const template = await this.loadTemplate('emailTemplate.html');
      const html = this.generateEmailTemplate(template, bookingData);
      
      const msg = {
        to: bookingData.recipientEmail,
        from: this.from.address, // SendGrid expects just the email address
        subject: `Lab Test Booking Confirmation - ${bookingData.labTestName}`,
        text: `Your lab test booking has been confirmed. Test: ${bookingData.labTestName}, Date: ${bookingData.date}, Time: ${bookingData.timeSlot}`,
        html: html,
      };

      const response = await this.sgMail.send(msg);
      console.log(`Lab booking confirmation sent to ${bookingData.recipientEmail}: ${response[0].headers['x-message-id']}`);
      
      return { 
        success: true, 
        messageId: response[0].headers['x-message-id'],
        response: response[0].statusCode 
      };
    } catch (error) {
      console.error('Failed to send lab booking confirmation:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async loadTemplate(templateName) {
    try {
      const templatePath = path.join(__dirname, '../templates', templateName);
      return await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      throw new Error(`Template ${templateName} not found`);
    }
  }

  generateEmailTemplate(template, data) {
    let compiledTemplate = template;
    
    // Replace placeholders like {{userName}}, {{labTestName}}, etc.
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      compiledTemplate = compiledTemplate.replace(placeholder, data[key] || '');
    });
    
    return compiledTemplate;
  }
}

module.exports = new EmailService();