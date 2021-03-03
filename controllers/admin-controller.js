const fileHelper = require('../util/file');

const Post = require("../models/posts");
const User = require("../models/users");

exports.getAllPosts = (req, res, next) => {
  const userId = req.user._id;
  return Post.find({ 'user.userId': userId })
    .then(posts => {
      res.render('admin/all-posts', {
        pageTitle: 'All your posts',
        userId: req.user,
        posts: posts
      })
    })
    .catch(err => {
      console.log(err);
    })
}

//////////////////////////////////////////////////

exports.getDeletePost = (req, res, next) => {
  const postId = req.params.postId;
  res.render('admin/all-posts', {
    pageTitle: 'All your posts',
    userId: req.user
  })
}

exports.postDeletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if(post.imageUrl) {
        fileHelper.deleteFile(post.imageUrl);
      }
      return Post.deleteOne({ _id: postId, 'user.userId': req.user._id })
    })
    .then(() => {
      console.log('Post deleted!');
      res.redirect(`/all-posts/${req.user._id}`);
    })
    .catch(err => {
      console.log(err);
    })
}

//////////////////////////////////////////////////

exports.getEditPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      res.render('admin/edit-post', {
        pageTitle: 'Edit post',
        userId: req.user,
        post: post
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const image = req.file;
  const updatedDescription = req.body.description;
  Post.findById(postId)
    .then(post => {
      // if (post.user.userId.toString() !== req.user._id.toString()) {
      //   return res.redirect('/');
      // }
      post.description = updatedDescription;
      if(image) {
        fileHelper.deleteFile(post.imageUrl);
        post.imageUrl = image.path;
      }
      return post.save()
        .then(result => {
          console.log('Post updated!');
          res.redirect(`/all-posts/${req.user._id}`);
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    })
}

/////////////////////////////////////////////////////////

exports.getDeleteAccount = (req, res, next) => {
  const userId = req.user._id;
  Post.findById(userId)
    .then(user => {
      res.render('admin/delete-account', {
        pageTitle: 'Delete account',
        userId: req.user,
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postDeleteAccount = (req, res, next) => {
  const userId = req.params.userId;

  Post.find({ 'user.userId': userId })
    .then(post => {
      return Post.deleteMany({ 'user.userId': req.user._id })
    })
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
}
