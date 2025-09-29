const express = require('express');
const SmsController = require('../controllers/smsController');

const router = express.Router();

// POST /api/v1/sms/confirm - Send booking confirmation SMS (no OTP)
router.post('/confirm', SmsController.sendBookingConfirmation);

module.exports = router;


