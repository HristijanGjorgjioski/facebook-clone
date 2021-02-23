const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const Post = require('../models/posts');
const Comment = require('../models/comments');

////////////////////////////////////////

exports.getPosts = (req, res, next) => {
  return Post.find()
    .then(posts => {
      // console.log(posts);
      res.render('feed/wall', {
        pageTitle: 'Feed',
        posts: posts,
        userId: req.user
      })
    })
    .catch(err => {
      console.log(err);
    })
}

////////////////////////////////////////

exports.getAddPost = (req, res, next) => {
  res.render('feed/wall',
    pageTitle = 'Feed'
  )
}

exports.postAddPost = (req, res, next) => {
  const image = req.file;
  const description = req.body.description;
  if(image == undefined) {
    // const imageUrl = null;
    const post = new Post({
      description,
      // imageUrl,
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
    });
  } else {
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
    });
  }
}

exports.getOnePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      Comment.find({ 'postId': postId })
        .exec()
        .then(comment => {
          res.render('feed/post-detail', {
            pageTitle: 'Feed',
            post: post,
            postId: postId,
            comment: comment,
            userId: req.user
          })
        })
    })
    .catch(err => {
      console.log(err);
    });
}

////////////////////////////////////////

exports.postAddComment = (req, res, next) => {
  const postId = req.body.postId;
  const commentBody = req.body.comment;

  const comment = new Comment({
    description: commentBody,
    postId: postId,
    user: {
      name: req.user.name,
      userId: req.user
    }
  })
  comment
    .save()
    .then(comm => {
      console.log('Comment added!')
      res.redirect(`/post/${postId}`);
    })
    .catch(err => {
      console.log(err);
    })
}

///////////////////////////////////////

