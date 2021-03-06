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
        friendId: Schema.Types.ObjectId,
        friendName: String,
        friendEmail: String,
        friendProfilePhoto: String
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
    return frd.friendId.toString() === friend._id.toString();
  });
  console.log(friend._id);
  console.log(friendsListIndex);
  const updatedFriendsList = [...this.friends.list];
  if(friendsListIndex !== -1) {
    updatedFriendsList.push();
  } else {
    updatedFriendsList.push({
      friendId: friend._id,
      friendName: friend.name,
      friendEmail: friend.email,
      friendProfilePhoto: friend.profilePhoto
    });
  }

  const updatedUser = {
    list: updatedFriendsList
  }
  this.friends = updatedUser;
  return this.save();
}

userSchema.methods.deleteFriend = function(friend) {
  const updatedFriendsList = this.friends.list.filter(frd => {
    return frd.friendId.toString() !== friend._id.toString();
  })
  this.friends.list = updatedFriendsList;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);
