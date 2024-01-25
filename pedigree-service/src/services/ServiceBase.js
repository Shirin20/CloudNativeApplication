/**
 * Module for the parseBlogDataServiceBase.
 * This class provides a service to parse blog data from a file.
 *
 * @author Ragdoll
 * @version 1.0.0
 */

import { User } from '../models/users.js'

/**
 * Encapsulates a ServiceBase class
 */
export class ServiceBase {
  /**
   * Adds a follower to a user.
   *
   * @param {string} followerId - The ID of the follower.
   * @param {string} followedUserId - The ID of the user to be followed.
   * @returns {Promise<void>}
   */
  async addFollower (followerId, followedUserId) {
    // Find the user document by userId
    let followedUserDoc = await User.findOne({ userId: followedUserId })
    if (!followedUserDoc) {
      followedUserDoc = new User({
        userId: followedUserId,
        followedUsers: [],
        followers: []
      })
    }

    // Add the followerId to the followers array if it's not already there
    if (!followedUserDoc.followers.includes(followerId)) {
      followedUserDoc.followers.push(followerId)
      await followedUserDoc.save()
    }
  }

  /**
   * Adds a followed user to the follower's list.
   *
   * @param {string} followerId - The ID of the follower.
   * @param {string} followedUserId - The ID of the user being followed.
   * @returns {Promise<void>}
   */
  async addFollowedUser (followerId, followedUserId) {
    // Find the user that is following document by userId
    let followerDoc = await User.findOne({ userId: followerId })
    if (!followerDoc) {
      followerDoc = new User({
        userId: followerId,
        followedUsers: [],
        followers: []
      })
    }

    // Add the followedUserId to the followedUsers array of the follower if it's not already there
    if (!followerDoc.followedUsers.includes(followedUserId)) {
      followerDoc.followedUsers.push(followedUserId)
      await followerDoc.save()
    }
  }

  /**
   * Deletes a followed user from the follower's list.
   *
   * @param {object} expressResponseObject - The response object provided by Express.js for sending back HTTP responses.
   * @param {string} followerId - The ID of the follower.
   * @param {string} followedUserId - The ID of the user being followed.
   * @returns {Promise<object>} A promise that resolves to the Express.js response object.
   */
  async deleteFollowedUser (expressResponseObject, followerId, followedUserId) {
    // Find the follower
    const followerDoc = await User.findOne({ userId: followerId })
    if (!followerDoc) {
      return expressResponseObject.status(404).json({ message: 'The followed user not found' })
    }

    // Delete the followedUserId from the followedUsers array of the follower if it's there
    if (followerDoc.followedUsers.includes(followedUserId)) {
      followerDoc.followedUsers.pop(followedUserId)
      await followerDoc.save()
    }
  }

  /**
   * Deletes a follower from a user's followers list.
   *
   * @param {object} expressResponseObject - The response object provided by Express.js for sending back HTTP responses.
   * @param {string} followerId - The ID of the follower.
   * @param {string} followedUserId - The ID of the user who is followed.
   * @returns {Promise<object>} A promise that resolves to the Express.js response object.
   */
  async deleteFollower (expressResponseObject, followerId, followedUserId) {
    // search for the followed user.
    const followedUserDoc = await User.findOne({ userId: followedUserId })
    if (!followedUserDoc) {
      return expressResponseObject.status(404).json({ message: 'followedUser not found' })
    }

    // Delete the followerId from the followers array if it's there
    if (followedUserDoc.followers.includes(followerId)) {
      followedUserDoc.followers.pop(followerId)
      await followedUserDoc.save()
    }
  }

  /**
   * Retrieves a list of users that a specific user follows.
   *
   * @param {string} userId - The ID of the user whose followings are to be retrieved.
   * @returns {Promise<Array<string>>} A promise that resolves to an array of user IDs.
   */
  async getUsersFollowedUsers (userId) {
    const userDoc = await User.findOne({ userId })
    if (!userDoc) {
      return null
    } else {
      return userDoc.followedUsers
    }
  }

  /**
   * Retrieves a list of followers for a specific user.
   *
   * @param {string} userId - The ID of the user whose followers are to be retrieved.
   * @returns {Promise<Array<string>>} A promise that resolves to an array of follower IDs.
   */
  async getUsersFollowers (userId) {
    const userDoc = await User.findOne({ userId })
    if (!userDoc) {
      return null
    } else {
      return userDoc.followers
    }
  }
}
