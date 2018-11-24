const express = require ('express');
const router = express.Router();
const Rental = require('../models/rental');
const User = require('../models/user');
const UserCtrl = require ('../controllers/user');


router.post('', UserCtrl.authMiddleware, function (req,res) {
  const {title, city, street, category, image, bedrooms, shared, description, dailyRate} = req.body;
  const user = res.locals.user;

  if(!title||!city||!street||!category||!image||!description) {
    return  res.status(422).send({
      errors:[{
        title:'Data missing!',
        detail:'Provide all mandatory data'
      }]});
  }

  const rental = new Rental ({
    title, city, street, category, image, bedrooms, shared, description, dailyRate, user
  });

  rental.save(function(err){
    if (err){
      return res.status(422).send({errors:normalizeErrors(err.errors)});
    }
    User.updateOne({_id: user.id}, {$push: {rentals:rental}}, function () {});
    return res.status(200).json({rental});
  });

});

router.get('/secret',UserCtrl.authMiddleware, function(req,res) {
  res.json({'secret': true});
});

router.get('', function (req,res) {
  const city = req.query.city;
  const query = city? {city:city.toLowerCase()} : {};

  Rental.find(query)
      .select('-bookings')
      .exec(function(err,foundRentals){
        if (err) {
          return res.status(422).send({errors:normalizeErrors(err.errors)});
        }

        if (city && foundRentals.length === 0) {
          return res.status(422).send({
            errors:[{
              title:'No Rental Found!',
              detail:`There are no rentals for city ${city}`
            }]});
        }
        res.json(foundRentals);
      });


});

router.get('/:id',function(req,res){
  const rentalId=req.params.id;
  Rental.findById(rentalId)
        .populate('user','username -_id')
        .populate('bookings','startAt endAt -_id')
        .exec( function (err, foundRental) {
          if (err) {
            res.status(422).send(
              {errors:[{
                title:'Rental Error',
                details:'Could not find rental'
              }]});      
          }
          return res.json(foundRental);
        });

});



module.exports =router;