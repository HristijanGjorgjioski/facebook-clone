const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: {
    type: String,
  },
  user: {
    name: {
      type: String,
      required: true
    },
    profilePhoto: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  postId: {
    type: String,
    ref: 'Post',
    required: true
  }
}, { timestamps: true } );

module.exports = mongoose.model('Comment', postSchema);