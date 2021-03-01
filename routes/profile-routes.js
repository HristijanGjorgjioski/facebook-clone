const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const profileController = require('../controllers/profile-controller');

router.get('/view-profile/:friendId', profileController.getViewProfile);

router.post('/add-friend', profileController.postAddFriend);

router.post('/delete-friend', profileController.postDeleteFriend);

module.exports = router;
