const Post = require("../models/posts");

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

exports.getDeletePost = (req, res, next) => {
  const postId = req.params.postId;
  res.render('admin/all-posts', {
    pageTitle: 'All your posts'
  })
}

exports.postDeletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      return Post.deleteOne({ _id: postId, 'user.userId': req.user._id })
    })
    .then(() => {
      console.log('Product deleted!');
      res.redirect(`/all-posts/${req.user._id}`);
    })
}
