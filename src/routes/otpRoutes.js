const express = require('express');
const OtpController = require('../controllers/otpController');

const router = express.Router();

// POST /api/v1/otp/send - Send OTP to phone number
router.post('/send', OtpController.sendOtp);

// POST /api/v1/otp/verify - Verify OTP
router.post('/verify', OtpController.verifyOtp);

// GET /api/v1/otp/status/:phone_number - Get OTP status for a phone number
router.get('/status/:phone_number', OtpController.getOtpStatus);

// POST /api/v1/otp/cleanup - Clean up expired OTPs (admin endpoint)
router.post('/cleanup', OtpController.cleanupExpiredOtps);

module.exports = router;
