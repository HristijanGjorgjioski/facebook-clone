const path = require('path');

const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const sendgrid = require('@sendgrid/mail');

const User = require('../models/users');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    errorMessage: null,
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
    errorMessage: null,
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

///////////////////////////////

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset-password', {
    pageTitle: 'Password reset',
    errorMessage: null
  })
}

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset-password');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        sendgrid.setApiKey('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');
        sendgrid.send({
          from: 'hristijangorgioski501@gmail.com',
          to: req.body.email,
          subject: 'Password reset',
          html: `
            <h2>You requested a password reset. Click <a href="http://localhost:3000/new-password/${token}">HERE</a></h2>
            <h2>and change your password. We hope you enjoy our app!</h2>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render('auth/new-password', {
        pageTitle: 'Set new password',
        errorMessage: null,
        userId: user._id.toString(),
        passwordToken: token
      });
    }).catch(err => {
      console.log(err);
    })
}

exports.postNewPassword = (req, res, next) => {
  const token = req.params.token;
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      res.redirect(`http://localhost:3000/new-password/${token}`);
      console.log(err);
    });
}

/////////////////////////////////////////////////

exports.getChangeData = (req, res, next) => {
  res.render('auth/change-data', {
    pageTitle: 'Change your data',
    errorMessage: null
  })
}

exports.postChangeData = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/change-data');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        sendgrid.setApiKey('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');
        sendgrid.send({
          from: 'hristijangorgioski501@gmail.com',
          to: req.body.email,
          subject: 'Change your data',
          html: `
            <h2>You requested to change your data. Click <a href="http://localhost:3000/change-data/${token}">HERE</a></h2>
            <h2>and change your password. We hope you enjoy our app!</h2>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
}

exports.getNewData = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      res.render('auth/new-data', {
        pageTitle: 'Change your data',
        errorMessage: null,
        userId: user._id.toString(),
        oldInput: {
          email: user.email,
          name: user.name
        },
        dataToken: token
      });
    }).catch(err => {
      console.log(err);
    })
}

exports.postNewData = (req, res, next) => {
  const newEmail = req.body.email;
  const newName = req.body.name;
  const userId = req.body.userId;
  const dataToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: dataToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      resetUser.email = newEmail;
      resetUser.name = newName;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
}

///////////////////////////////////////////

exports.getEditProfile = (req, res, next) => {
  const userId = req.user;
  res.render('auth/edit-profile', {
    pageTitle: 'Edit profile',
    userId: req.user
  })
}

exports.postEditProfile = (req, res, next) => {
  const user = req.user;
  const photo = req.file;
  const profilePhoto = photo.path;
  if(!profilePhoto) {
    res.redirect(`edit-profile/${user._id}`)
  }

  const update = { profilePhoto: profilePhoto }

  User
    .findOneAndUpdate({ '_id': user._id }, update)
    .then(updatedUser => {
      console.log('Profile photo added!');
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
}

////////////////////////////////////////////////////

exports.getViewProfile = (req, res, next) => {
  // const userId = req.params.userId;
  res.render('feed/view-profile', {
    pageTitle: 'Profile',
    userId: req.user
  })
}
