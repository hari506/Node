const mongoose = require('mongoose');

let toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required field'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required filed'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

let ToursModal = mongoose.model('Tours', toursSchema);

module.exports = ToursModal;
