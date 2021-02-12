const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const User = require('../models/users');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    errorMessage: [],
    oldInput: {
      name: '',
      email: ''
    }
  });
}

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name,
        email
      }
    })
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    })
}

exports.getLogin = (req, res, next) => {
  email = req.body.email;
  res.render('auth/login', {
    pageTitle: 'Login',
    errorMessage: [],
    oldInput: {
      email: '',
      password: ''
    }
  });
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: ''
      }
    })
  }

  return User.findOne({ email })
    .then(user => {
      bcrypt
        .compare(password, user.password)
        .then(result => {
          console.log("User logged in!");
          res.redirect('/');
        })
    })
}
