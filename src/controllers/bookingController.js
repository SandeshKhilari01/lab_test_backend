const bookingService = require('../services/bookingService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class BookingController {
  
  // POST /api/v1/bookings
  async createBooking(req, res) {
    try {
      const bookingData = req.body;
      
      // Basic validation
      if (!bookingData.phone_number || !bookingData.customer_name) {
        return errorResponse(res, 'Phone number and customer name are required', 400);
      }
      
      const result = await bookingService.createBooking(bookingData);
      
      return successResponse(res, 'Booking created successfully', result, 201);
      
    } catch (error) {
      console.error('Create booking error:', error);
      return errorResponse(res, 'Failed to create booking', 500, error.message);
    }
  }
  
  // GET /api/v1/bookings/phone (also supports :phone)
  async getBookingsByPhone(req, res) {
    try {
      const phone = req.body.phone || req.params.phone;
      
      if (!phone) {
        return errorResponse(res, 'Phone number is required', 400);
      }
      
      const result = await bookingService.getBookingsByPhone(phone);
      
      if (result.total_bookings === 0) {
        return successResponse(res, 'No bookings found for this phone number', result);
      }
      
      return successResponse(res, `Found ${result.total_bookings} booking(s)`, result);
      
    } catch (error) {
      console.error('Get bookings error:', error);
      return errorResponse(res, 'Failed to fetch bookings', 500, error.message);
    }
  }
  
  // GET /api/v1/bookings (also supports :id)
  async getBookingById(req, res) {
    try {
      const id = req.body.id || req.params.id;
      
      const booking = await bookingService.getBookingById(id);
      
      return successResponse(res, 'Booking found', booking);
      
    } catch (error) {
      console.error('Get booking error:', error);
      if (error.message === 'Booking not found') {
        return errorResponse(res, 'Booking not found', 404);
      }
      return errorResponse(res, 'Failed to fetch booking', 500, error.message);
    }
  }
  
  // PUT /api/v1/bookings (also supports :id)
  async updateBooking(req, res) {
    try {
      const id = req.body.id || req.params.id;
      const updateData = req.body;
      
      const booking = await bookingService.updateBooking(id, updateData);
      
      return successResponse(res, 'Booking updated successfully', booking);
      
    } catch (error) {
      console.error('Update booking error:', error);
      if (error.message === 'Booking not found') {
        return errorResponse(res, 'Booking not found', 404);
      }
      return errorResponse(res, 'Failed to update booking', 500, error.message);
    }
  }

  // PUT /api/v1/bookings/phone (also supports :phone)
  async updateBookingByPhone(req, res) {
    try {
      const phone = req.body.phone || req.params.phone;
      const updateData = req.body;

      if (!phone) {
        return errorResponse(res, 'Phone number is required', 400);
      }

      const booking = await bookingService.updateBookingByPhone(phone, updateData);

      return successResponse(res, 'Booking updated successfully', booking);

    } catch (error) {
      console.error('Update booking by phone error:', error);
      if (error.message === 'Booking not found') {
        return errorResponse(res, 'Booking not found', 404);
      }
      return errorResponse(res, 'Failed to update booking', 500, error.message);
    }
  }
  
  // DELETE /api/v1/bookings (also supports :id)
  async cancelBooking(req, res) {
    try {
      const id = req.body.id || req.params.id;
      
      const result = await bookingService.cancelBooking(id);
      
      return successResponse(res, 'Booking cancelled successfully', result);
      
    } catch (error) {
      console.error('Cancel booking error:', error);
      if (error.message === 'Booking not found') {
        return errorResponse(res, 'Booking not found', 404);
      }
      return errorResponse(res, 'Failed to cancel booking', 500, error.message);
    }
  }

  // DELETE /api/v1/bookings/phone (also supports :phone)
  async cancelBookingByPhone(req, res) {
    try {
      const phone = req.body.phone || req.params.phone;

      if (!phone) {
        return errorResponse(res, 'Phone number is required', 400);
      }

      const result = await bookingService.cancelBookingByPhone(phone);

      return successResponse(res, 'Booking cancelled successfully', result);

    } catch (error) {
      console.error('Cancel booking by phone error:', error);
      if (error.message === 'Booking not found') {
        return errorResponse(res, 'Booking not found', 404);
      }
      return errorResponse(res, 'Failed to cancel booking', 500, error.message);
    }
  }
}

module.exports = new BookingController();