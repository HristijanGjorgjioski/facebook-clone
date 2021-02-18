const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const postController = require('../controllers/post-controller');

router.get('/', postController.getPosts);

router.get('/', postController.getAddPost);

router.post('/add-post', postController.postAddPost);

router.get('/post/:postId', postController.getOnePost);

router.get('/add-comment/:postId', postController.getOnePost);

router.post('/add-comment', postController.postAddComment);

module.exports = router;