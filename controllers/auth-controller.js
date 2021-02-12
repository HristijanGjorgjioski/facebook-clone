const User = require('../models/users');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup');
}

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const user = new User({
    name: name,
    email: email,
    password: password
  });
  return user.save();
}

exports.getLogin = (req, res, next) => {
  res.render('auth/login');
}
