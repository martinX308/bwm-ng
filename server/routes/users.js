const express = require ('express');
const User = require('../controllers/user');
const router = express.Router();

router.post('/auth',User.auth);

router.post('/register', User.register);

router.get('/:id',User.authMiddleware,User.getUser);

module.exports =router;