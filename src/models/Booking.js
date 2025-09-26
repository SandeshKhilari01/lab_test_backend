const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: true,
    index: true  // For fast lookups by AI agent
  },
  
  // Customer details
  customer_name: {
    type: String,
    required: true
  },
  customer_email: {
    type: String,
    required: false
  },
  
  // Booking details
  booking_type: {
    type: String,
    enum: ['home_collection', 'walk_in_lab'],
    required: true
  },
  test_code: {
    type: String,
    required: true
  },
  test_name: {
    type: String,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  },
  
  // Appointment details
  appointment_date: {
    type: String,
    required: true
  },
  appointment_time: {
    type: String,
    required: true
  },
  
  // Location details
  address: {
    type: String,
    required: function() {
      return this.booking_type === 'home_collection';
    }
  },
  lab_id: {
    type: String,
    required: function() {
      return this.booking_type === 'walk_in_lab';
    }
  },
  phlebotomist_id: {
    type: String,
    required: function() {
      return this.booking_type === 'home_collection';
    }
  },
  
  // Status
  booking_status: {
    type: String,
    enum: ['confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  
  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);