const express = require('express');
const mongoose = require('mongoose');
const config= require('./config/dev');
const FakeDb = require('./models/fake-db');

const rentalRoutes= require ('./routes/rentals');

mongoose.connect(config.DB_URI)
  .then(() => {
    const fakeDb = new FakeDb();
    fakeDb.seedDb();
  });

const app= express();

app.use('/api/v1/rentals',rentalRoutes);

app.get('/rentals', function(req,res){
  res.json({'success':true});
})

const Port = process.env.Port||3001;

app.listen(Port,function(){
  console.log('I am running');
});