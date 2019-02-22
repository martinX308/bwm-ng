const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config= require('./config/dev');
const FakeDb = require('./fake-db');

const rentalRoutes= require ('./routes/rentals'),
      userRoutes= require ('./routes/users'),
      bookingRoutes= require ('./routes/bookings'),
      paymentRoutes = require ('./routes/payments'),
      imageUploadRoutes = require('./routes/image-upload'),
      reviewRoutes = require('./routes/reviews');

mongoose.connect(
  config.DB_URI,
  { useNewUrlParser: true, useCreateIndex: true }
)
  .then(() => {
    //const fakeDb = new FakeDb();
    //fakeDb.seedDb();
  });

const app= express();

app.use(bodyParser.json());

app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1', imageUploadRoutes);



const Port = process.env.Port||3001;

app.listen(Port,function(){
  console.log('I am running');
});