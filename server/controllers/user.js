const User = require ('../models/user');
const {normalizeErrors} = require ('../helpers/mongoose');
const jwt = require ('jsonwebtoken');
const config = require('../config/dev');

exports.getUser = function(req,res) {
  const requestedUserId = req.params.id;
  const user = res.locals.user;

  if(requestedUserId === user.id){
    User.findById(requestedUserId, function(err, foundUser){
      if (err) {
        return res.status(422).send({errors:normalizeErrors(err.errors)});
      }
      return res.json(foundUser);
    });
  } else {
    User.findById(requestedUserId)
      .select('-revenue -stripeCustomerId -password -email')
      .exec(function(err,foundUser){
        if (err) {
          return res.status(422).send({errors:normalizeErrors(err.errors)});
        }
        return res.json(foundUser);
      });
  }

}

exports.auth = function (req,res) {
  const {email, password} =req.body;

  if(!password||!email) {
    return  res.status(422).send({
       errors:[{
         title:'Data missing!',
         detail:'Provide email and password'
       }]});
   }

   User.findOne({email},function (err,user){
    if (err){
      return res.status(422).send({errors:normalizeErrors(err.errors)});
    }

    if(!user) {
      return  res.status(422).send({
        errors:[{
          title:'Invalid user',
          detail:'User does not exist'
        }]});
    }
    if(user.isSamePassword(password)){
      const token= jwt.sign({
        userId: user.id,
        username:user.username
      }, config.SECRET, { expiresIn: '1h' });

      return res.json(token);

    } else {
      return  res.status(422).send({
        errors:[{
          title:'Wrong data',
          detail:'Wrong email or password'
        }]});
    }

   });
}



exports.register = function (req,res) {
  const {username,email, password,passwordConfirmation} =req.body;
  

  if(!password||!email) {
   return  res.status(422).send({
      errors:[{
        title:'Data missing!',
        detail:'Provide email and password'
      }]});
  }

  if(password !== passwordConfirmation) {
    return res.status(422).send({
      errors:[{
        title:'Invalid password!',
        detail:'Password is not the same as confirmation!'
      }]});
  }

  User.findOne({email},function(err,existingUser){
    if (err){
      return res.status(422).send({errors:normalizeErrors(err.errors)});
    }

    if (existingUser) {
      return res.status(422).send({errors:[{titel:'invalid email',detail :'user with this mail already exists'}]});
    }

    const user = new User({
      username,
      email,
      password
    });
    
    user.save(function(err){
      if (err){
        return res.status(422).send({errors:normalizeErrors(err.errors)});
      }
      return res.status(200).json({'registered':true});
    });
  });

}

exports.authMiddleware = function (req,res,next) {
  const token = req.headers.authorization;
  if (token) {
    const user = parseToken (token);
    User.findById(user.userId, function (err,user) {
      if (err) {
        return res.status(422).send({errors:normalizeErrors(err.errors)});
      }

      if (user) {
        res.locals.user = user;
        next();
      } else {
        notAuthorized();
      }

    })
  } else {
    notAuthorized(res);
}

}

function parseToken(token) {
  return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res){
  return res.status(401).send({errors:[{titel:'not authorized',detail :'Please login'}]});
}