const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin-controller');

router.get('/all-posts/:userId', adminController.getAllPosts);

router.get('/delete-post/:postId', adminController.postDeletePost);

router.post('/delete-post', adminController.getDeletePost);

router.get('/edit-post/:postId', adminController.getEditPost);

router.post('/edit-post', adminController.postEditPost);

router.get('/delete-account/:userId', adminController.getDeleteAccount);

router.post('/delete-account', adminController.postDeleteAccount);

module.exports = router;
