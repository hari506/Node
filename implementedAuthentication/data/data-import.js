const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const tourModel = require('./../models/toursModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DB_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connected successfully !');
});

let tours = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));

const importData = async () => {
  try {
    await tourModel.insertMany(tours);
    console.log('data inserted successfully !');
  } catch (err) {
    console.log(' ERROR : ', err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await tourModel.deleteMany();
    console.log('DATA deleted successfully !');
  } catch (err) {
    console.log('ERROR:', err);
  }
  process.exit();
};

if (process.argv[2] == '__import') {
  importData();
} else if (process.argv[2] == '__delete') {
  deleteData();
}
console.log(process.argv);
