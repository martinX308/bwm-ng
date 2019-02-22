const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const allowedRatings = [1,2,3,4,5];

const reviewSchema = new Schema({
  rating: Number,
  text: String,
  user:{ type: Schema.Types.ObjectId, ref:'User'},
  rental:{ type: Schema.Types.ObjectId, ref:'Rental'},
  booking:{ type: Schema.Types.ObjectId, ref:'Booking'},
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.pre('save',function(next){
  if(allowedRatings.indexOf(this.rating) >= 0){
    next();
  } else {
    const err = new Error ();
    err.errors = {};
    err.errors.rating = {message: 'This rating is not allowed'};
    next(err);
  }
});

module.exports = mongoose.model('Review',reviewSchema);
