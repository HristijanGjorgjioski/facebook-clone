const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');
const sendgrid = require('@sendgrid/mail');

const User = require('../models/users');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    errorMessage: [],
    oldInput: {
      name: '',
      email: ''
    },
    csrfToken: req.csrfToken()
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

  User.findOne({ email })
    .then(user => {
      if(!user) {
        return res.status(422).render('auth/login', {
          pageTitle: 'Login',
          errorMessage: errors.array()[0].msg,
          oldInput: {
            email: email,
            password: ''
          }
        })
      }
      bcrypt
    .compare(password, user.password)
    .then(doMatch => {
      if(doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      }
      return res.status(422).render('auth/login', {
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: ''
        }
      })
      .catch(err => {
        console.log(err);
        res.redirect('/login');
      })
    })
    })
    .catch(err => {
      console.log(err);
    })    
}

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset-password', {
    pageTitle: 'Password reset',
    errorMessage: []
  })
}

exports.postResetPassword = (req, res, next) => {
  userEmail = req.body.email;
  sendgrid.setApiKey('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');
  const message = {
    from: 'hristijangorgioski501@gmail.com',
    to: userEmail,
    subject: 'Password reset',
    html: `
      <h2>You requested a password reset. Click <a href="http://localhost:3000/reset">HERE</a></h2>
      <h2>and change your password. We hope you enjoy our app!</h2>
    `
  }
  sendgrid.send(message);
  res.redirect('/');
}

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset',
    errorMessage: []
  })
}
