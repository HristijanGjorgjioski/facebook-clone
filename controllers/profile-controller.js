const User = require('../models/users');
const Post = require('../models/posts');

exports.getViewProfile = (req, res, next) => {
  const friendId = req.params.friendId;
  User.findById(req.user._id)
    .then(user => {
      console.log(user.friends.list[1].friendId);
      console.log(user.friends.list.length);
    })
  User.findById(friendId)
  .then(user => {
    Post.find({ 'user.userId': friendId })
    .then(posts => {
          let sameUser;
          if(friendId.toString() === req.user._id.toString()) {
            sameUser = true;
          } else {
            sameUser = false;
          }
          res.render('feed/view-profile', {
            pageTitle: 'Profile',
            userId: req.user,
            user: user,
            posts: posts,
            errorMessage: null,
            sameUser: sameUser
          })
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postAddFriend = (req, res, next) => {
  const user = req.user;
  const friendId = req.body.userId;

  User.findById(user._id)
    .then(user => {
      User.findById(friendId)
        .then(friend => {
          return req.user.addFriend(friend);
        })
        .then(result => {
          console.log('Friend added!')
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    })
}
