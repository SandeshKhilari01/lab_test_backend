const fs = require('fs').promises;
const path = require('path');
const emailConfig = require('../config/nodemailer');

class EmailService {
  constructor() {
    this.transporterPromise = emailConfig.transporterPromise;
    this.from = emailConfig.from;
  }

  async verifyConnection() {
    try {
      const transporter = await this.transporterPromise;
      await transporter.verify();
      console.log('Email service connected successfully');
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
      
      const mailOptions = {
        from: this.from,
        to: bookingData.recipientEmail,
        subject: `Lab Test Booking Confirmation - ${bookingData.labTestName}`,
        html: html,
        text: `Your lab test booking has been confirmed. Test: ${bookingData.labTestName}, Date: ${bookingData.date}, Time: ${bookingData.timeSlot}`
      };

      const transporter = await this.transporterPromise;
      const info = await transporter.sendMail(mailOptions);
      console.log(`Lab booking confirmation sent to ${bookingData.recipientEmail}: ${info.messageId}`);
      
      return { 
        success: true, 
        messageId: info.messageId,
        response: info.response 
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