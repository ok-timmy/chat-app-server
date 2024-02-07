import { Request, Response } from "express";
import { Feed } from "../Models/Feed";
import { Comment } from "../Models/Comment";
import { User } from "../Models/User";
import { IFeed } from "../Interfaces/Feed.interface";
import { Types } from "mongoose";

//Get all feeds
export const getAllFeeds = async (
  req: Request,
  res: Response
): Promise<Object> => {
  try {
    const foundFeeds = await Feed.find()
      .sort({ updatedAt: -1 })
      .populate("author", "firstName lastName userName profilePic")
      .exec();
    return res.status(200).send(foundFeeds);
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured",
      error,
    });
  }
};

//Get Single User Feed
export const getSingleUserFeed = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { id } = req.params;
  console.log(id);

  try {
    const userFeeds = await Feed.find().sort({ updatedAt: -1 })
    .populate("author", "_id firstName lastName userName profilePic")
    .exec();
    const foundFeeds = [];
    const userFoundFeeds = userFeeds.filter((userfeed) => {
      if (userfeed.author._id.toString() === id) {
        return foundFeeds.push(userfeed);
      }
    });

    return res
      .status(200)
      .json({ message: "User feeds found", data: userFoundFeeds });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An Error occured when trying to fetch data" });
  }
};

//Create Feed
export const createFeed = async (
  req: Request,
  res: Response
): Promise<Object> => {
  try {
    const { content, author } = req.body;
    if (!content) {
      return res.status(202).json({
        message: "Feed content Cannot be empty",
      });
    }
    if (!author) {
      return res.status(403).json({
        message: "No User Id found in request, check request body",
      });
    }
    const newFeed = {
      content: content,
      author: author,
    };
    try {
      const createdFeed = (await Feed.create({ ...newFeed })).populate(
        "author",
        "userName firstName lastName profilePic"
      );

      const feedPopulated = await User.populate(createdFeed, {
        path: "feed.author",
        select: "id userName firstName lastName profilePic",
      });
      return res.status(200).json({
        message: "Post Created Successfully",
        data: feedPopulated,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong while trying to save Feed, try again",
        data: error,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An Error Occured",
      error,
    });
  }
};

//Edit Feed
export const editFeed = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const id = { _id: req.params.id };
  const { content, authorId } = req.body;

  const feedToBeEdited = await Feed.findById(id).populate(
    "author",
    "_id firstName userName lastName"
  );
  if (authorId !== (feedToBeEdited?.author?._id).toString()) {
    return res.status(403).json({
      message: "This User cannot edit this feed as they are not the author",
    });
  }

  try {
    const updatedFeed = await Feed.findByIdAndUpdate(
      id,
      {
        $set: {
          content: content,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Feed Updated Successfully",
      result: updatedFeed,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An Error Occured, Please Try again",
      error,
    });
  }
};

//Delete Feed
export const deleteFeed = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const id = { _id: req.params.id };

  const { authorId } = req.body;

  const feedToBeDeleted = await Feed.findById(id).populate(
    "author",
    "_id firstName userName lastName"
  );
  if (authorId !== (feedToBeDeleted?.author?._id).toString()) {
    return res.status(403).json({
      message: "This User cannot edit this feed as they are not the author",
    });
  }

  try {
    await Feed.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Feed Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured, Please Try Again",
      error,
    });
  }
};

//Like Feed
export const likeFeed = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { postId, userId } = req.params;

  try {
    const foundFeed: IFeed | null = await Feed.findOne({
      _id: postId,
    }).populate("likes", "_id firstName lastName userName");

    let updatedFeed;
    let prevTotalLikes = foundFeed?.numberOfLikes as number;
    let increasedLikes = prevTotalLikes + 1;
    let decreasedLikes = prevTotalLikes - 1;

    let isLiked: boolean | undefined;

    foundFeed?.likes?.find((like: Types.ObjectId) => {
      console.log(like?._id.toString());
      if (like?._id.toString() === userId) {
        isLiked = true;
      } else isLiked = false;
    });

    if (isLiked) {
      updatedFeed = await Feed.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: userId,
          },
          $set: {
            numberOfLikes: decreasedLikes,
          },
        },
        { new: true }
      );
    } else {
      updatedFeed = await Feed.findByIdAndUpdate(
        postId,
        {
          $push: {
            likes: {
              _id: userId,
            },
          },
          $set: {
            numberOfLikes: increasedLikes,
          },
        },
        { new: true }
      );
    }

console.log(updatedFeed)
    return res.status(200).json({
      message: "Post Likes updated successfully",
      result: updatedFeed?.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured, Try Again",
      error,
    });
  }
};

// Share Feed
export const shareFeed = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { postId } = req.params;
  const foundFeed: IFeed | null = await Feed.findOne({ _id: postId });
  let prevNumOfShare = foundFeed?.numberOfShares as number;
  const newNumOfShare = prevNumOfShare + 1;

  try {
    const foundFeed = await Feed.findByIdAndUpdate(
      postId,
      {
        $set: {
          numberOfShares: newNumOfShare,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Number of Shares Updated Successfully",
      result: foundFeed,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured, Try Again",
      error,
    });
  }
};

//Comment On Feed
export const postComment = async (
  req: Request,
  res: Response
): Promise<Object> => {
  try {
    const { commenter, content } = req.body;

    const { postId } = req.params;

    if (!content) {
      return res.status(403).json({
        message: "No content in comment, please input a comment",
      });
    }

    const newComment = new Comment({
      postId,
      commenter,
      content,
    });
    var newCommentCreated = (
      await (
        await Comment.create(newComment)
      ).populate("commenter", "fullName userName profilePic _id")
    ).populate("postId", "feedImage content author");
    var commenterPopulated = await User.populate(newCommentCreated, {
      path: "commenter",
      select: "fullName userName profilePic _id",
    });
    const commentPopulated = await Feed.populate(commenterPopulated, {
      path: "comment.postId comment.commenter",
      select: "feedImage content author firstName lastName userName _id",
    });

    const updateCommentOnFeed = await Feed.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: commentPopulated._id,
        },
      },
      { new: true }
    ).populate("comments", "commenter content");

    // console.log("Comment saved successfully");

    return res.status(200).json({
      message: "Comment Posted Successfully",
      comment: commentPopulated,
      parentFeed: updateCommentOnFeed,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured, Try Again",
      error,
    });
  }
};
