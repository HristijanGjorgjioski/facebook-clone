const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin-controller');
const isAuth = require('../middleware/is-auth');

router.get('/all-posts/:userId', isAuth, adminController.getAllPosts);

router.get('/delete-post/:postId', isAuth, adminController.postDeletePost);

router.post('/delete-post', isAuth, adminController.getDeletePost);

router.get('/edit-post/:postId', isAuth, adminController.getEditPost);

router.post('/edit-post', isAuth, adminController.postEditPost);

router.get('/delete-account/:userId', isAuth, adminController.getDeleteAccount);

router.post('/delete-account', isAuth, adminController.postDeleteAccount);

router.get('/friends-list/:userId', isAuth, adminController.getFriendList);

module.exports = router;
