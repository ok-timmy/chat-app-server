import { Request, Response } from "express";
import { User } from "../Models/User";
import { IUser } from "../Interfaces/user.interface";

//Function to add friend
export const sendFriendRequest = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { friendId, userId } = req.body;

  if (!friendId || !userId) {
    return res.status(404).json({
      message: "No Id provided in body of request",
    });
  }

  try {
    //Check if friend does not exist in the list of friends before
    const friendExist = await User.find({
      $or: [
        { sentRequests: { $elemMatch: { $eq: friendId } } },
        { friends: { $elemMatch: { $eq: friendId } } },
      ],
    }).populate("users", "-password");

    const doesFriendExist = await User.populate(friendExist, {
      path: "friends",
      select: " -password",
    });

    if (doesFriendExist.length > 0) {
      return res.status(204).json({
        message:
          "Friend Already exist either in Sent Friend Requests or as a friend",
      });
    } else {
      const newfriendToBeAdded = await User.findByIdAndUpdate(
        userId,
        {
          $push: { sentRequests: friendId },
        },
        {
          new: true,
        }
      ).select("_id userName firstName lastName profilePic");

      await User.findByIdAndUpdate(
        friendId,
        {
          $push: {
            friendRequests: userId,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Friend Request successfully Sent",
        data: newfriendToBeAdded,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occured while performing the process",
      error,
    });
  }
};

//  Correct Function.
/*
It stores friend request ID insted of friend ID
It also returns users details when it sends requests successfully
*/

//Function to accept friend request
export const acceptFriendRequest = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { friendRequestId, friendId, userId } = req.body;

  if (!friendRequestId || !userId) {
    return res.status(404).json({
      message: "No friend request Id or User Id sent with request body",
    });
  }

  try {
    const doesFriendRequestExist = await User.find({
      $and: [
        { sentRequests: { $elemMatch: { $eq: friendRequestId } } },
        { friends: { $elemMatch: { $eq: friendRequestId } } },
      ],
    }).populate("users", "-password");

    const doesFriendExist = await User.populate(doesFriendRequestExist, {
      path: "friends",
      select: " -password",
    });

    if (doesFriendExist.length > 0) {
      return res.status(204).json({
        message: "Friend exists either in sent friend requests or as a friend",
      });
    } else {
      const newfriendToBeAdded = await User.findByIdAndUpdate(
        userId,
        {
          $push: { friends: friendId },
          $pull: { friendRequests: { $elemMatch: { $eq: friendRequestId } } },
        },
        {
          new: true,
        }
      );

      await User.findByIdAndUpdate(
        friendId,
        {
          $push: { friends: userId },
          $pull: { sentRequests: { $elemMatch: { $eq: userId } } },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Friend successfully Added",
        data: newfriendToBeAdded,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occured when performing this process",
      error,
    });
  }
};

//Delete FriendRequest You dont want to accept
export const deleteFriendRequest = async (req: Request, res: Response) => {
  const { userId, friendRequestId } = req.body;

  if (!friendRequestId || !userId) {
    return res.status(404).json({
      message: "No friend request Id or User Id sent with request body",
    });
  }

  try {
    //Check if friend does not exist in the list of friends before
    const friendExist = await User.find({
      $or: [
        { sentRequests: { $elemMatch: { $eq: friendRequestId } } },
        { friends: { $elemMatch: { $eq: friendRequestId } } },
      ],
    }).populate("users", "-password");

    const doesFriendExist = await User.populate(friendExist, {
      path: "friends",
      select: " -password",
    });

    if (doesFriendExist.length > 0) {
      return res.status(204).json({
        message:
          "Friend Already exist either in Sent Friend Requests or as a friend",
      });
    } else {
      const updatedFriendRequestList = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { friendRequests: { $elemMatch: { $eq: friendRequestId } } },
        },
        {
          new: true,
        }
      ).select("_id firstName lastName userName profilePic");

      await User.findByIdAndUpdate(
        friendRequestId,
        {
          $pull: {
            sentRequests: { $elemMatch: { $eq: userId } },
          },
        },
        { new: true }
      ).populate("friends");

      return res.status(200).json({
        message: "Friend Request successfully Sent",
        data: updatedFriendRequestList,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      message: "Friend request removed successfully",
      error,
    });
  }
};

//Fetch All Friends of a particular user
export const getFriends = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({ message: "No User Id Provided" });
  }
  try {
    const friends = await User.find({ _id: userId }).populate(
      "friends",
      "-password"
    );

    return res
      .status(200)
      .json({ message: "Friends successfully fetched", data: friends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

//Fetch All Friend Requests of a particular user
export const getAUserFriendRequests = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({ message: "No User Id Provided" });
  }
  try {
    const friends = await User.find({ _id: userId }).populate(
      "friendRequests",
      "-password -accessToken -refreshToken"
    );

    return res
      .status(200)
      .json({ message: "Friend Requests successfully fetched", data: friends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

//Remove a particular friend and stop being friends with them
export const unFriend = async (req: Request, res: Response) => {
  const { friendId, userId } = req.body;

  if (!friendId || !userId) {
    return res.status(404).json({
      message: "No friend request Id or User Id sent with request body",
    });
  }

  try {
    //Check if friend does not exist in the list of friends before
    const friendExist = await User.find({
      $or: [
        { sentRequests: { $elemMatch: { $eq: friendId } } },
        { friendRequests: { $elemMatch: { $eq: friendId } } },
      ],
    }).populate("users", "-password");

    const doesFriendExist = await User.populate(friendExist, {
      path: "friends",
      select: " -password",
    });

    if (doesFriendExist.length > 0) {
      return res.status(204).json({
        message:
          "Friend Already exist either in Sent Friend Requests or as a friend request",
      });
    } else {
      const updatedFriendRequestList = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { friends: { $elemMatch: { $eq: friendId } } },
        },
        {
          new: true,
        }
      );

      await User.findByIdAndUpdate(
        friendId,
        {
          $pull: {
            friends: { $elemMatch: { $eq: userId } },
          },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Friend List successfully Updated",
        data: updatedFriendRequestList,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      message: "Something went wrong while processing the request",
      error,
    });
  }
};

