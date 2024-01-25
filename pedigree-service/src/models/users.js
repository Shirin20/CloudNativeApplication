import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  favoriteCat: {
    type: String
  },
  followedUsers: [{ // Array of user IDs the iser is following
    type: String
  }],
  followers: [{ // Array of user IDs following the user
    type: String
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    // eslint-disable-next-line jsdoc/require-jsdoc
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const User = mongoose.model('User', schema)
