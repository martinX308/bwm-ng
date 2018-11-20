const bcrypt =require('bcrypt');
const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const Rental=require('./rental');

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    minlength: [4, 'Username is too short, min is 4 characters'],
    maxlength: [32, 'Username is too long, max is 32 characters']
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [4, 'Password is too short, min is 4 characters'],
    maxlength: [32, 'Password is too long, max is 32 characters']
  },
  email: { 
    type: String, 
    required: 'Email is required',
    minlength: [4, 'Email is too short, min is 4 characters'],
    maxlength: [32, 'Email is too long, max is 32 characters'],
    unique:true, 
    lowercase: true,
    match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Email format not correct']
  },
  rentals: [{
    type: Schema.Types.ObjectId,
    ref:'Rental'
    }
  ]
});

userSchema.methods.isSamePassword = function (requestedPassword){
  return bcrypt.compareSync(requestedPassword,this.password);
};

userSchema.pre('save',function(next){
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
  });
  
});

module.exports = mongoose.model('User',userSchema);