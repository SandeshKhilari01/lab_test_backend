const SmsService = require('../services/smsService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class SmsController {
  // POST /api/v1/sms/confirm
  static async sendBookingConfirmation(req, res) {
    try {
      const { phone_number, user_name, lab_test_name, date, time_slot, address } = req.body;

      if (!phone_number || !lab_test_name || !date || !time_slot) {
        return errorResponse(res, 'phone_number, lab_test_name, date, and time_slot are required', 400);
      }

      const phoneRegex = /^\+[1-9]\d{9,14}$/;
      if (!phoneRegex.test(phone_number)) {
        return errorResponse(res, 'Invalid phone number format. Please use international format (e.g., +1234567890)', 400);
      }

      const greetingName = user_name ? `Hi ${user_name},` : 'Hello,';
      const nameText = user_name ? `${user_name}, ` : '';
      const locationText = address ? `, Location: ${address}` : '';
      const body = `${greetingName} Lab booking confirmation: Name: ${nameText}Test: ${lab_test_name}, Date: ${date}, Time: ${time_slot}${locationText}.`;

      const result = await SmsService.sendTextMessage(phone_number, body);

      return successResponse(res, 'Booking confirmation SMS sent successfully', {
        phone_number,
        lab_test_name,
        date,
        time_slot,
        address: address || null,
        message_sid: result.sid
      });
    } catch (error) {
      console.error('Send Booking Confirmation SMS error:', error);
      return errorResponse(res, error.message || 'Failed to send booking confirmation SMS', 500);
    }
  }
}

module.exports = SmsController;


