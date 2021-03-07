const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const profileController = require('../controllers/profile-controller');
const isAuth = require('../middleware/is-auth');

router.get('/view-profile/:friendId', isAuth, profileController.getViewProfile);

router.post('/add-friend', isAuth, profileController.postAddFriend);

router.post('/delete-friend', isAuth, profileController.postDeleteFriend);

module.exports = router;
