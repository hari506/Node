const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DB_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);
mongoose.connect(DB).then(() => console.log('db connection successfully!'));
/*mongoose
  .connect(process.env.DB_LOCAL)
  .then(() => console.log('db connection successfully!'));*/

//SCEMA

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

let toursDoc = new ToursModal({
  name: 'khammam',
  price: 3000,
  rating: 4.3,
});

toursDoc
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(' ERROR : ', err);
  });

//server start
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('servier listening...');
});
