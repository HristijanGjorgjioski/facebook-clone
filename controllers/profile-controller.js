const User = require('../models/users');
const Post = require('../models/posts');

exports.getViewProfile = (req, res, next) => {
  User.findById(req.params.friendId)
  .then(friend => {
    Post.find({ 'user.userId': req.params.friendId })
    .then(posts => {
          let sameUser;
          let alreadyFriend;
          User.findById(req.user._id)
            .then(user => {
              const friendIndex = user.friends.list.filter(frd => {
                return frd.friendId.toString() === req.params.friendId.toString()
              })
              if(friendIndex === undefined || friendIndex.length === 0) {
                alreadyFriend = false;
              } else {
                alreadyFriend = true;
              }

              if(req.params.friendId.toString() === req.user._id.toString()) {
                sameUser = true;
              } else {
                sameUser = false;
              }
              res.render('feed/view-profile', {
                pageTitle: 'Profile',
                userId: req.user,
                friend: friend,
                posts: posts,
                errorMessage: null,
                alreadyFriend: alreadyFriend,
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
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postAddFriend = (req, res, next) => {
  const user = req.user;
  const friendId = req.body.friendId;

  User.findById(user._id)
    .then(user => {
      User.findById(friendId)
        .then(friend => {
          console.log(friend);
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

exports.postDeleteFriend = (req, res, next) => {
  const user = req.user;
  const friendId = req.body.friendId;

  User.findById(user._id)
    .then(user => {
      User.findById(friendId)
      .then(friend => {
        return req.user.deleteFriend(friend);
      })
      .then(result => {
        console.log('Friend deleted!');
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
