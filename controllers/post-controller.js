const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const Post = require('../models/posts');

exports.getPosts = (req, res, next) => {
  return Post.find()
    .then(posts => {
      console.log(posts);
      res.render('feed/wall', {
        pageTitle: 'Feed',
        posts: posts
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getAddPost = (req, res, next) => {
  res.render('feed/wall',
    pageTitle = 'Feed'
  )
}

exports.postAddPost = (req, res, next) => {
  const image = req.file;
  const description = req.body.description;
  const imageUrl = image.path;

  const post = new Post({
    description,
    imageUrl,
    user: {
      name: req.user.name,
      userId: req.user
    } 
  });
  post
    .save()
    .then(result => {
      console.log("Post is created!");
      res.redirect('/');
    })
}

