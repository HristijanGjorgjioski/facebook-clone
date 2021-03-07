const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const postController = require('../controllers/post-controller');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, postController.getPosts);

router.get('/', isAuth, postController.getAddPost);

router.post('/add-post', isAuth, postController.postAddPost);

router.get('/post/:postId', isAuth, postController.getOnePost);

router.get('/add-comment/:postId', isAuth, postController.getOnePost);

router.post('/add-comment', isAuth, postController.postAddComment);

module.exports = router;