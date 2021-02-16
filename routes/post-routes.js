const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const postController = require('../controllers/post-controller');

router.get('/', postController.getPosts);

router.get('/', postController.getAddPost);

router.post('/add-post', postController.postAddPost);

router.get('/:postId', postController.getOnePost);

module.exports = router;