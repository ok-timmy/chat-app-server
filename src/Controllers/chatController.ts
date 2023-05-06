import { Request, Response } from "express";
import { Chat } from "../Models/Chat";
import { User } from "../Models/User";

// GET ALL THE MESSAGES IN A PARTICULAR CHAT
export const fetchChatMessages = async (
  req: Request,
  res: Response
): Promise<Object> => {
  try {
    return Chat.find({ users: { $elemMatch: { $eq: req.body._id } } })
      .populate("users", "-password")
      .populate("latestMessages")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        const populatedChat = await User.populate(result, {
          path: "latestMessage.sender",
          select: "profilePic fullName userName email",
        });

        return res.sendStatus(200).json({ data: populatedChat });
      })
      .catch((error) => {
        return res.sendStatus(400).json({
          message: "An error occured while fetching chats",
          error,
        });
      });
  } catch (error) {
    return res.sendStatus(404).json({
      message: "Could not find chat",
      error,
    });
  }
};

//CREATE A NEW CHAT WITH A NEW USER
export const createNewChat = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { recipientId, senderId } = req.body;

  if (!recipientId) {
    return res.sendStatus(404).json({
      message: "No User found",
    });
  }

  const doesChatExist = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.body.senderId } } },
      { users: { $elemMatch: { $eq: req.body.recipientId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  const newChat = await User.populate(doesChatExist, {
    path: "latestMessage.sender",
    select: " firstName profilePic email",
  });

  if (newChat.length > 0) {
    return res.sendStatus(200).json({
      message: "Chat Found",
      data: newChat[0],
    });
  } else {
    const chatData = {
      chatName: "sender",
      users: [senderId, recipientId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res.sendStatus(200).json({
        message: "Chat created and fetched successfull",
        data: fullChat,
      });
    } catch (error) {
      return res.sendStatus(404).json({
        message: "An error occured while fetching the chat",
        error,
      });
    }
  }
};
