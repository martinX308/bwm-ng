const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const bookingSchema = new Schema({
  endAt: { type: Date, required: [true, 'Ending date is required']},
  startAt: { type: Date, required: [true, 'Start date is required']},
  totalPrice: Number,
  days: Number,
  guests: Number,
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref:'User'},
  rental: { type: Schema.Types.ObjectId, ref:'Rental'},
  payment: { type: Schema.Types.ObjectId, ref:'Payment'},
  review: { type: Schema.Types.ObjectId, ref:'Review'},
  status: { type: String, default: 'pending'}
});

module.exports = mongoose.model('Booking',bookingSchema);