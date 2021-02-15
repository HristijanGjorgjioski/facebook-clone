const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const feedController = require('../controllers/feed-controller');

router.get('/', feedController.getWall);

module.exports = router;