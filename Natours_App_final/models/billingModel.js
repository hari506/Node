const mongoose = require('mongoose');

let billingSchema = new mongoose.Schema({
  billingName: {
    type: String,
    required: [true, 'name must be enter'],
  },
  billingAmount: {
    type: Number,
    required: [true, 'billing amount required'],
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: [true, 'booking information required'],
  },
  billingAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Billing', billingSchema);
