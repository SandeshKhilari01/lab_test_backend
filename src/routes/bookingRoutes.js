const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Create booking
router.post('/', bookingController.createBooking);

// Get bookings by phone number
router.get('/phone/:phone', bookingController.getBookingsByPhone);
// Body-based alternative: { phone }
router.get('/phone', bookingController.getBookingsByPhone);

// Update latest active booking by phone number
router.put('/phone/:phone', bookingController.updateBookingByPhone);
// Body-based alternative: { phone, ...updates }
router.put('/phone', bookingController.updateBookingByPhone);

// Cancel latest active booking by phone number
router.delete('/phone/:phone', bookingController.cancelBookingByPhone);
// Body-based alternative: { phone }
router.delete('/phone', bookingController.cancelBookingByPhone);

// Get specific booking
router.get('/:id', bookingController.getBookingById);

// Update booking
router.put('/:id', bookingController.updateBooking);

// Cancel booking
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;