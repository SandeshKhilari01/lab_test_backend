const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    index: true
  },
  otp_code: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } 
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create TTL index for automatic document deletion after expiration
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
