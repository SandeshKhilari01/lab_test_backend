const OtpService = require('../services/otpService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class OtpController {
  // Send OTP to phone number
  static async sendOtp(req, res) {
    try {
      const { phone_number } = req.body;

      // Validate phone number
      if (!phone_number) {
        return errorResponse(res, 'Phone number is required', 400);
      }

      // Basic phone number validation (should start with + and have 10-15 digits)
      const phoneRegex = /^\+[1-9]\d{9,14}$/;
      if (!phoneRegex.test(phone_number)) {
        return errorResponse(res, 'Invalid phone number format. Please use international format (e.g., +1234567890)', 400);
      }

      const result = await OtpService.sendOtp(phone_number);

      return successResponse(res, result.message, {
        phone_number: phone_number,
        expires_at: result.expires_at
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      return errorResponse(res, error.message || 'Failed to send OTP', 500);
    }
  }

  // Verify OTP
  static async verifyOtp(req, res) {
    try {
      const { phone_number, otp_code } = req.body;

      // Validate required fields
      if (!phone_number || !otp_code) {
        return errorResponse(res, 'Phone number and OTP code are required', 400);
      }

      // Validate OTP format (4 digits)
      const otpRegex = /^\d{4}$/;
      if (!otpRegex.test(otp_code)) {
        return errorResponse(res, 'OTP code must be 4 digits', 400);
      }

      const result = await OtpService.verifyOtp(phone_number, otp_code);

      if (result.success) {
        return successResponse(res, result.message, {
          phone_number: phone_number,
          verified: true
        });
      } else {
        return errorResponse(res, result.message, 400);
      }

    } catch (error) {
      console.error('Verify OTP error:', error);
      return errorResponse(res, error.message || 'Failed to verify OTP', 500);
    }
  }

  // Get OTP status for a phone number
  static async getOtpStatus(req, res) {
    try {
      const { phone_number } = req.params;

      if (!phone_number) {
        return errorResponse(res, 'Phone number is required', 400);
      }

      const result = await OtpService.getOtpStatus(phone_number);

      if (result.success) {
        return successResponse(res, 'OTP status retrieved successfully', result.data);
      } else {
        return errorResponse(res, result.message, 404);
      }

    } catch (error) {
      console.error('Get OTP status error:', error);
      return errorResponse(res, error.message || 'Failed to get OTP status', 500);
    }
  }

  // Clean up expired OTPs (admin endpoint)
  static async cleanupExpiredOtps(req, res) {
    try {
      const deletedCount = await OtpService.cleanupExpiredOtps();

      return successResponse(res, 'Expired OTPs cleaned up successfully', {
        deleted_count: deletedCount
      });

    } catch (error) {
      console.error('Cleanup expired OTPs error:', error);
      return errorResponse(res, error.message || 'Failed to cleanup expired OTPs', 500);
    }
  }
}

module.exports = OtpController;
