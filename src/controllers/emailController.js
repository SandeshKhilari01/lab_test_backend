const emailService = require('../services/emailService');

const emailController = {
  // Send lab booking confirmation email
  async sendLabBookingConfirmation(req, res) {
    try {
      const { 
        recipientEmail, 
        userName, 
        labTestName, 
        date, 
        timeSlot,
        bookingId,
        location,
        contactNumber,
        instructions
      } = req.body;

      // Validation
      if (!recipientEmail || !userName || !labTestName || !date || !timeSlot) {
        return res.status(400).json({
          success: false,
          message: 'Required fields: recipientEmail, userName, labTestName, date, timeSlot'
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address'
        });
      }

      // Prepare booking data
      const bookingData = {
        recipientEmail,
        userName,
        labTestName,
        date,
        timeSlot,
        bookingId: bookingId || `LB${Date.now()}`,
        location: location || 'Main Lab Center',
        contactNumber: contactNumber || '+1-234-567-8900',
        instructions: instructions || 'Please arrive 15 minutes before your scheduled time.',
        currentYear: new Date().getFullYear()
      };

      const result = await emailService.sendLabBookingConfirmation(bookingData);

      res.status(200).json({
        success: true,
        message: 'Lab booking confirmation email sent successfully',
        data: {
          messageId: result.messageId,
          recipientEmail: recipientEmail,
          bookingId: bookingData.bookingId
        }
      });
    } catch (error) {
      console.error('Error in sendLabBookingConfirmation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send lab booking confirmation email',
        error: error.message
      });
    }
  }
};

module.exports = emailController;