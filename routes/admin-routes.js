const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin-controller');

router.get('/all-posts/:userId', adminController.getAllPosts);


module.exports = router;
