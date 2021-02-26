const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String
  },
  friends: {
    list: [
      {
        friendId: String,
        friendName: String,
        friendEmail: String
      }
    ]
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date
});

userSchema.methods.addFriend = function(friend) {
  const friendsListIndex = this.friends.list.findIndex(frd => {
    console.log(frd.friendId.toString());
    console.log(friend._id.toString());
    return frd.friendId.toString() === friend._id.toString();
  });
  const updatedFriendsList = [...this.friends.list];
  console.log(friendsListIndex);
  if(!friendsListIndex) {
    updatedFriendsList.push();
  } else {
    updatedFriendsList.push({
      friendId: friend._id,
      friendName: friend.name,
      friendEmail: friend.email
    });
  }

  // updatedFriendsList.push({
  //   friendId: friend._id,
  //   friendName: friend.name,
  //   friendEmail: friend.email
  // });

  const updatedUser = {
    list: updatedFriendsList
  }
  this.friends = updatedUser;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);
