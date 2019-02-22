const User = require ('../models/user');
const Rental = require ('../models/rental');
const Booking = require ('../models/booking');
const Review = require ('../models/review');
const moment = require ('moment');
const {normalizeErrors} = require ('../helpers/mongoose');

exports.getReviews = function (req,res) {
  const { rentalId } = req.query;
  Review.find({'rental': rentalId})
    .populate('user')
    .exec((err,reviews) => {
      if (err) {
        return res.status(422).send({errors:normalizeErrors(err.errors)});
      }

      return res.json(reviews);
    });
}

exports.createReview = function (req,res){
  const reviewData = req.body;
  const { bookingId } = req.query;
  const user = res.locals.user;

  Booking.findById(bookingId)
    .populate({path:'rental', populate:{path:'user'}})
    .populate('review')
    .populate('user')
    .exec(async (err,foundBooking)=>{

      if (err) {
        return res.status(422).send({errors:normalizeErrors(err.errors)});
      }

      const {rental} = foundBooking;

      if(rental.user.id === user.id){
        return  res.status(422).send({
          errors:[{
            title:'Invalid user',
            detail:'Owner cannot create review on your rental!'
          }]});
      }

      const foundBookingUserId =foundBooking.user.id;
      if(foundBookingUserId !== user.id){
        return  res.status(422).send({
          errors:[{
            title:'Invalid user',
            detail:'You cannot create review on this booking!'
          }]});
      }

      const timeNow = moment();
      const endAt = moment(foundBooking.endAt);

      if(!endAt.isBefore(timeNow)){
        return  res.status(422).send({
          errors:[{
            title:'Invalid date',
            detail:'You can place review only after your trip is finished!'
          }]});
      }

      if(foundBooking.review){
        return  res.status(422).send({
          errors:[{
            title:'Booking error',
            detail:'Only one review per booking allowed!'
          }]});
      }

      const review = new Review(reviewData);
      review.user = user;
      review.rental= rental;
      foundBooking.review = review;

      try {
        await foundBooking.save();
        const savedReview = await review.save();
        return res.json(savedReview);
      } catch (err){
        return res.status(422).send({errors:normalizeErrors(err.errors)});
      }

    });
}

exports.getRentalRating = function(req,res) {
  const rentalId = req.params.Id;
  Review.aggregate([
    {$unwind:"$rental"}
   , {$group:{"_id":rentalId, "ratingAvg":{$avg:"$rating"}}}
    ],
    function(err,result){
      if(err){
        return res.status(422).send({errors:normalizeErrors(err.errors)});
      } else {
        console.log(result);
        return res.json(result[0]['ratingAvg']);
      }
    })
}

