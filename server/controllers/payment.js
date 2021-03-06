const Payment = require ('../models/payment');
const Rental = require ('../models/rental');
const User = require ('../models/user');
const Booking = require ('../models/booking');
const config = require('../config/dev');
const stripe = require('stripe')(config.STRIPE_SK);

const {normalizeErrors} = require ('../helpers/mongoose');

exports.getPendingPayments = function(req, res) {
  const user = res.locals.user;
  Payment
    .where({toUser: user})
    .populate({
      path:'booking',
      populate: {path: 'rental'}
    })
    .populate('fromUser')
    .exec(function(err, foundPayments) {
      if(err){
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }
      return res.json(foundPayments);
    })
}

exports.confirmPayment = function(req,res) {
  const payment = req.body;
  const user = res.locals.user;

  Payment.findById(payment._id)
    .populate('toUser')
    .populate('booking')
    .exec(async function(err,foundPayment){

      if(err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)})
      }

      if(foundPayment.status === 'pending' && user.id === foundPayment.toUser.id) {
        const booking = foundPayment.booking
        const charge = await stripe.charges.create({
          amount: booking.totalPrice * 100,
          currency: 'usd',
          customer: payment.fromUser.stripeCustomerId
        })

        if(charge) {
          Booking.updateOne({_id: booking.id}, {status: 'active'}, function(){});
          foundPayment.charge = charge;
          foundPayment.status = 'paid';
          foundPayment.save(function(err){
            if(err) {
              return res.status(422).send({errors: normalizeErrors(err.errors)});
            } 

            User.updateOne({_id: foundPayment.toUser}, {$inc: {revenue: foundPayment.amount}}, function(err,user){
              if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)});
              }
              return res.json({status:'paid'});
            });
          })
        }

      }
    })
}

exports.declinePayment = function(req,res){
  const payment = req.body;
  const {booking} = payment;
  
  Booking.deleteOne({id: booking._id}, (err, deletedBooking)=> {
    if(err){
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    Payment.updateOne({_id: payment._id},{status: 'declined'}, ()=>{});
    Rental.updateOne({_id:booking.rental._id},{$pull:{bookings:booking._id}}, ()=>{});

    return res.json({status: 'inactive'});

  })
}