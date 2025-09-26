const moment = require('moment');

const generateBookingId = () => {
  const date = moment().format('YYYYMMDD');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${process.env.BOOKING_ID_PREFIX || 'BKG'}${date}${randomNum}`;
};

module.exports = {
  generateBookingId
};