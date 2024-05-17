const express = require('express');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/userRouter');
let app = express();

app.use(express.json());
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
