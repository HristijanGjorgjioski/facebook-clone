const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth-controller');

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
    body('password')
      .isLength({ min: 6 })
      .trim()
      .withMessage("Wrong email or password")
  ], 
  authController.postLogin
);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset', authController.getReset);

module.exports = router;
