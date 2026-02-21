const twilio = require('twilio');
const Otp = require('../models/Otp');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('Twilio credentials not found. OTP SMS functionality will be disabled.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

class OtpService {
  // Generate a random 4-digit OTP
  static generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Send OTP via SMS
  static async sendOtp(phoneNumber) {
    try {
      if (!client) {
        throw new Error('Twilio client not initialized. Please check your environment variables.');
      }

      // Generate OTP
      const otpCode = this.generateOtp();
      
      // Set expiration time (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Invalidate any existing OTP for this phone number
      await Otp.updateMany(
        { phone_number: phoneNumber, is_verified: false },
        { is_verified: true } // Mark as verified to invalidate
      );

      // Create new OTP record
      const otpRecord = new Otp({
        phone_number: phoneNumber,
        otp_code: otpCode,
        expires_at: expiresAt
      });

      await otpRecord.save();

      // Send SMS
      const message = await client.messages.create({
        body: `Your OTP code is: ${otpCode}. This code will expire in 10 minutes.`,
        from: twilioPhoneNumber,
        to: phoneNumber
      });

      console.log(`OTP sent to ${phoneNumber}. Message SID: ${message.sid}`);

      return {
        success: true,
        message: 'OTP sent successfully',
        expires_at: expiresAt,
        otpCode : otpCode
      };

    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }

  // Verify OTP
  static async verifyOtp(phoneNumber, otpCode) {
    try {
      // Find the most recent unverified OTP for this phone number
      const otpRecord = await Otp.findOne({
        phone_number: phoneNumber,
        otp_code: otpCode,
        is_verified: false,
        expires_at: { $gt: new Date() } // Not expired
      }).sort({ created_at: -1 });

      if (!otpRecord) {
        // Increment attempts for failed verification
        await Otp.updateMany(
          { phone_number: phoneNumber, is_verified: false },
          { $inc: { attempts: 1 } }
        );
        
        return {
          success: false,
          message: 'Invalid or expired OTP'
        };
      }

      // Mark OTP as verified
      otpRecord.is_verified = true;
      await otpRecord.save();

      return {
        success: true,
        message: 'OTP verified successfully'
      };

    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error(`Failed to verify OTP: ${error.message}`);
    }
  }

  // Get OTP status for a phone number
  static async getOtpStatus(phoneNumber) {
    try {
      const otpRecord = await Otp.findOne({
        phone_number: phoneNumber,
        is_verified: false,
        expires_at: { $gt: new Date() }
      }).sort({ created_at: -1 });

      if (!otpRecord) {
        return {
          success: false,
          message: 'No active OTP found for this phone number'
        };
      }

      return {
        success: true,
        data: {
          phone_number: otpRecord.phone_number,
          expires_at: otpRecord.expires_at,
          attempts: otpRecord.attempts,
          created_at: otpRecord.created_at
        }
      };

    } catch (error) {
      console.error('Error getting OTP status:', error);
      throw new Error(`Failed to get OTP status: ${error.message}`);
    }
  }

  // Clean up expired OTPs (optional - TTL index handles this automatically)
  static async cleanupExpiredOtps() {
    try {
      const result = await Otp.deleteMany({
        expires_at: { $lt: new Date() }
      });
      
      console.log(`Cleaned up ${result.deletedCount} expired OTPs`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
      throw error;
    }
  }
}

module.exports = OtpService;
