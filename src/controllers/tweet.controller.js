import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  try {
    const { content } = req.body;
    if (!content) {
      throw new ApiError(400, "Content is required");
    }
    const userId = req.user._id;
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    const tweet = new Tweet({
      content,
      owner: userId,
    });
    const createdTweet = await tweet.save();
    return res
      .status(200)
      .json(new ApiResponse(201, createdTweet, "Tweet created"));
  } catch (error) {
    res.json({ error: error.message });
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const tweets = await Tweet.find({ owner: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, tweets, "User tweets fetched"));
  } catch (error) {
    res.json({ error: error.message });
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  try {
    const { content } = req.body;
    if (!content) {
      throw new ApiError(400, "Content is required");
    }
    const tweet = await Tweet.findByIdAndUpdate(
        req.params.tweetId,
      { content },
      { new: true }
    );
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }
    return res
     .status(200)
     .json(new ApiResponse(200, tweet, "Tweet updated"));
  } catch (error) {
    res.json({ error: error.message });    
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  try {
    const tweet = await Tweet.findByIdAndDelete(req.params.tweetId);
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }
    return res
     .status(200)
     .json(new ApiResponse(200, null, "Tweet deleted"));
  } catch (error) {
    res.json({ error: error.message });    
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
