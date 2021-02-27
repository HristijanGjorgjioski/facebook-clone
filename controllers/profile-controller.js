const User = require('../models/users');
const Post = require('../models/posts');

exports.getViewProfile = (req, res, next) => {
  const friendId = req.params.friendId;
  const alredyFriend = User.find({ 'friends.list': friendId });
  User.findById(friendId)
  .then(user => {
    Post.find({ 'user.userId': friendId })
    .then(posts => {
          let sameUser;
          let alreadyInFrdList;
          console.log(alreadyInFrdList);
          if(alredyFriend === undefined) {
            alreadyInFrdList = true;
          } else {
            alreadyInFrdList = false;
          }
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
            sameUser: sameUser,
            alreadyInFrdList: alreadyInFrdList
          })
          console.log(alreadyInFrdList);
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
