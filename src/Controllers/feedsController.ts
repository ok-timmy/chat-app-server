import { Request, Response } from "express";
import { Feed } from "../Models/Feed";
import { Comment } from "../Models/Comment";
import { User } from "../Models/User";

//Get all feeds
exports.getAllFeeds = async (req: Request, res: Response): Promise<Object> => {
  try {
    const foundFeeds = await Feed.find().sort({ updatedAt: -1 }).exec();
    return res.status(200).json({
      message: "Retrieved All Posts",
      result: foundFeeds,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured",
      error,
    });
  }
};

//Create Feed
exports.createFeed = async (req: Request, res: Response): Promise<Object> => {
  try {
    const { content } = req.body;
    const newFeed = new Feed({
      content,
    });
    await newFeed.save();
    return res.status(200).json({
      message: "Post Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured",
      error,
    });
  }
};

//Edit Feed
exports.editFeed = async (req: Request, res: Response): Promise<Object> => {
  const id = { _id: req.params.id };
  const { content } = req.body;

  try {
    const updatedFeed = await Feed.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          content,
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
    return res.status(500).json({
      message: "An Error Occured, Please Try again",
      error,
    });
  }
};

//Delete Feed
exports.deleteFeed = async (req: Request, res: Response): Promise<Object> => {
  const id = { _id: req.params.id };

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
exports.likeFeed = async (req: Request, res: Response): Promise<Object> => {
  const { postId, userId } = req.params;

  try {
    const foundFeed = await Feed.findOne({ _id: postId });
    let updatedFeed;
    let prevTotalLikes = foundFeed?.numberOfLikes;
    let increasedLikes = prevTotalLikes && prevTotalLikes + 1;
    let decreasedLikes = prevTotalLikes && prevTotalLikes - 1;
    const hasLiked = foundFeed?.likes.find((id) => {
      if (id === userId) {
        return true;
      }
    });

    if (hasLiked) {
      updatedFeed = await Feed.findByIdAndUpdate(
        { _id: postId },
        {
          $pull: {
            likes: {
              $elemMatch: { _id: userId },
            },
          },
          $set: {
            numberOfLikes: {
              decreasedLikes,
            },
          },
        },
        { new: true }
      );
    } else {
      updatedFeed = await Feed.findByIdAndUpdate(
        { _id: postId },
        {
          $push: {
            likes: {
              _id: userId,
            },
          },
          $set: {
            numberOfLikes: {
              increasedLikes,
            },
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      message: "Post Likes updated successfully",
      result: updatedFeed,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured, Try Again",
      error,
    });
  }
};

// Share Feed
exports.shareFeed = async (req: Request, res: Response): Promise<Object> => {
  const { postId } = req.params;
  const foundFeed = await Feed.findOne({ _id: postId });
  let prevNumOfShare = foundFeed?.numberOfShares;
  const newNumOfShare = prevNumOfShare && prevNumOfShare + 1;

  try {
    const foundFeed = await Feed.findByIdAndUpdate(
      { _id: postId },
      {
        $set: {
          numberOfShares: {
            newNumOfShare,
          },
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
exports.postComment = async (req: Request, res: Response): Promise<Object> => {
  try {
    const { commenter, content } = req.body;

    const { postId } = req.params;

    const newComment = new Comment({
      postId,
      commenter,
      content,
    });
    var newCommentCreated = (await Comment.create(newComment)).populate(
      "commenter",
      "fullName, userName, profilePicture, _id"
    );
    // const comm = await newCommentCreated.populate("postId", "feedImage, content, author");
    console.log(newCommentCreated);

    console.log("Comment saved successfully");

    return res.status(200).json({
      message: "Comment Posted Successfully", 
      result: newCommentCreated
    })
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured, Try Again",
      error,
    });
  }
};
