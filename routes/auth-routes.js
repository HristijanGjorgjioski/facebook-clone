const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth-controller');
const isAuth = require('../middleware/is-auth');

router.get('/signup', authController.getSignup);

router.post(
  '/signup', 
  [
    body('name')
      .isAlphanumeric()
      .isLength({ min: 6 })
      .withMessage("Name must contain only letters and have at least 6 characters"),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email adress"),
    body('password')
      .isLength({ min: 6 })
      .trim()
      .withMessage("Password must have 6 characters")
  ],
  authController.postSignup
);

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage("Wrong email or password"),
    body('password', 'Wrong email or password')
      .isLength({ min: 6 })
      .trim()
  ], 
  authController.postLogin
);

/////////////////////////

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/new-password/:token', authController.getNewPassword);

router.post(
  '/new-password',
  [
    body('password', 'Password must have 6 characters')
      .isLength({ min: 6 })
      .trim()
  ], 
  authController.postNewPassword
);

/////////////////////////

router.get('/change-data', isAuth, authController.getChangeData);

router.post('/change-data', isAuth, authController.postChangeData);

router.get('/change-data/:token', isAuth, authController.getNewData);

router.post('/new-data', isAuth, authController.postNewData);

/////////////////////////////

router.get('/edit-profile/:userId', isAuth, authController.getEditProfile);

router.post('/edit-profile', isAuth, authController.postEditProfile);

////////////////////////////////////////////


module.exports = router;
