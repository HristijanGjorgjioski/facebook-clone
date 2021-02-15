const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const postController = require('../controllers/post-controller');

// router.get('/', feedController.getWall);

module.exports = router;