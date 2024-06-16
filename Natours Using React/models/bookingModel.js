const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingName: {
    type: String,
    required: [true, 'booking name is mandatory'],
  },
  bookingAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tours',
    required: [true, 'tour is mandatory'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: [true, 'user is mandatory'],
  },
  bookingAmount: {
    type: Number,
    required: [true, 'booking amount is required'],
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
