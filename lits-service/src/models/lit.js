/**
 * Mongoose model lit.
 *
 * @author Ragdolls
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  litText: {
    type: String,
    maxlength: [42, 'Lit text must not exceed 42 characters']
  },
  userPedigreeLink: {
    type: String
  },
  userId: {
    type: String,
    required: [true, 'User id is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
    }
  },
  toObject: {
    virtuals: true,
    versionKey: false
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
  }
})

/**
 * Authorize user for getting all lits where user is the creator.
 *
 * @param {*} req - Express request object.
 * @param {*} res - Express response object.
 * @param {*} next - Next function call.
 * @returns {boolean} - Authorize user true/false.
 */
schema.statics.authorizeUserLitModification = async function (req, res, next) {
  const lit = await Lit.findOne({ _id: req.params.id })

  return req.user.id === lit.userId
}

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Lit = mongoose.model('Lit', schema)
