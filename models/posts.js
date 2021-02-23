const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: {
    type: String,
  },
  imageUrl: {
    type: String
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
  }
}, { timestamps: true } );

module.exports = mongoose.model('Post', postSchema);
