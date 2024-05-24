const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DB_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);
mongoose.connect(DB).then(() => console.log('db connection successfully!'));

//connection to local db
/*mongoose
  .connect(process.env.DB_LOCAL)
  .then(() => console.log('db connection successfully!'));*/

//server start
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('servier listening...');
});
