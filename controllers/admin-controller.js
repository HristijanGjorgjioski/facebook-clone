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