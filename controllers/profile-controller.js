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
  const friendId = req.body.userId;

  User.findById(user._id)
    .then(user => {
      User.findById(friendId)
        .then(friend => {
          if(user._id.toString() === friendId.toString()) {
            console.log('You can not do that!');
            return res.redirect('/');
          }
           
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

  // User.findById(friendId)
  //   .then(friend => {
  //     const frd = [...User.friends.list];
      // const update = {
      //   friends: {
      //     list: [
      //       {
      //         friendId: friendId,
      //         friendName: friend.name,
      //         friendEmail: friend.email
      //       }
      //     ]
      //   }
      // };
    //   const updatedUser = frd.push({
    //     friendId: friendId,
    //     friendName: friend.name,
    //     friendEmail: friend.email
    //   });

    //   User.findOneAndUpdate({ '_id': user._id }, updatedUser)
    //     .then(updatedUser => {
    //       console.log('Friend added!');
    //       res.redirect('/');
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     })
    // })
    // .catch(err => {
    //   console.log(err);
    // })
}
