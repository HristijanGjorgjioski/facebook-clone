const User = require('../models/users');
const Post = require('../models/posts');
const { findById } = require('../models/users');

exports.getViewProfile = (req, res, next) => {
  const friendId = req.params.friendId;
  User.findById(friendId)
    .then(user => {
      Post.find({ 'user.userId': friendId })
        .then(posts => {
          res.render('feed/view-profile', {
            pageTitle: 'Profile',
            userId: req.user,
            user: user,
            posts: posts
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
  const friendId = req.params.friendId;

  const friend = User.findById(friendId);
  const update = {
    friends: {
      friend: [
        {
          friendId: friend._id,
          friendName: friend.name,
          friendEmail: friend.email
        }
      ]
    }
  };

  const update2 = { name: 'Apqala' };

  User.findOneAndUpdate({ '_id': user._id }, update)
    .then(updatedUser => {
      console.log('Friend added!');
      res.redirect('/');
      // res.redirect(`view-profile/${friendId}`);
    })
    .catch(err => {
      console.log(err);
    })  
}
