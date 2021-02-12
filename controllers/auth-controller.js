const bcrypt = require('bcryptjs');

const User = require('../models/users');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup'
  });
}

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = bcrypt.hashSync(password, 12);

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword
  });
  return user.save();
}

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login'
  });
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

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
