const Booking = require('../models/Booking');
const { generateBookingId } = require('../utils/idGenerator');

class BookingService {
  
  // Create new booking
  async createBooking(bookingData) {
    try {
      const bookingId = generateBookingId();
      
      const booking = new Booking({
        booking_id: bookingId,
        ...bookingData
      });
      
      const savedBooking = await booking.save();
      
      return {
        booking_id: savedBooking.booking_id,
        booking_reference: `LAB-${savedBooking.booking_id.slice(-3)}`,
        created_at: savedBooking.created_at
      };
      
    } catch (error) {
      if (error.code === 11000) { // Duplicate booking_id
        return await this.createBooking(bookingData); // Retry with new ID
      }
      throw error;
    }
  }
  
  // Get all bookings by phone number
  async getBookingsByPhone(phoneNumber) {
    try {
      const bookings = await Booking.find({ 
        phone_number: phoneNumber,
        booking_status: { $ne: 'cancelled' }
      }).sort({ created_at: -1 });
      
      return {
        total_bookings: bookings.length,
        bookings: bookings,
        latest_booking: bookings[0] || null
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // Get specific booking by ID
  async getBookingById(bookingId) {
    try {
      const booking = await Booking.findOne({ booking_id: bookingId });
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return booking;
      
    } catch (error) {
      throw error;
    }
  }
  
  // Update booking
  async updateBooking(bookingId, updateData) {
    try {
      const booking = await Booking.findOneAndUpdate(
        { booking_id: bookingId },
        { ...updateData, updated_at: new Date() },
        { new: true }
      );
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return booking;
      
    } catch (error) {
      throw error;
    }
  }

  // Update latest active booking by phone number
  async updateBookingByPhone(phoneNumber, updateData) {
    try {
      const booking = await Booking.findOneAndUpdate(
        { phone_number: phoneNumber, booking_status: { $ne: 'cancelled' } },
        { ...updateData, updated_at: new Date() },
        { new: true, sort: { created_at: -1 } }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      return booking;

    } catch (error) {
      throw error;
    }
  }
  
  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const booking = await Booking.findOneAndUpdate(
        { booking_id: bookingId },
        { booking_status: 'cancelled', updated_at: new Date() },
        { new: true }
      );
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return {
        booking_id: booking.booking_id,
        status: 'cancelled',
        cancelled_at: booking.updated_at
      };
      
    } catch (error) {
      throw error;
    }
  }

  // Cancel latest active booking by phone number
  async cancelBookingByPhone(phoneNumber) {
    try {
      const booking = await Booking.findOneAndUpdate(
        { phone_number: phoneNumber, booking_status: { $ne: 'cancelled' } },
        { booking_status: 'cancelled', updated_at: new Date() },
        { new: true, sort: { created_at: -1 } }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      return {
        booking_id: booking.booking_id,
        status: 'cancelled',
        cancelled_at: booking.updated_at
      };

    } catch (error) {
      throw error;
    }
  }
  
  // Helper functions for formatting
  formatDateForHuman(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const suffix = this.getOrdinalSuffix(day);
    return `${day}${suffix} ${month}`;
  }
  
  formatTimeForHuman(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  
  formatBookingType(type) {
    return type === 'home_collection' ? 'Home Collection' : 'Walk-in Lab';
  }
  
  formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  
  getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}

module.exports = new BookingService();