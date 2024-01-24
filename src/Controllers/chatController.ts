import { Request, Response } from "express";
import { Chat } from "../Models/Chat";
import { User } from "../Models/User";
import { IChat } from "../Interfaces/Chat.interface";

// GET ALL THE MESSAGES IN A PARTICULAR CHAT
export const fetchChatMessages = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { recipientId } = req.body;

  if (!recipientId) {
    return res.status(404).json({
      message: "Please provide a chatId in your request",
    });
  }

  try {
    const foundChat = await Chat.findById({
      users: { $elemMatch: { $eq: recipientId } },
    })

      .populate("users", "-password")
      .populate("latestMessages")
      .sort({ updatedAt: -1 });

    if (foundChat) {
      const populatedChat: Object | null = await User.populate(foundChat, {
        path: "latestMessage.sender",
        select: "profilePic fullName userName email",
      });

      return res.status(200).json({ data: populatedChat });
    } else {
      return res.status(400).json({
        message: "An error occured while fetching chats",
      });
    }
  } catch (error) {
    return res.status(404).json({
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

  if (!recipientId || !senderId) {
    return res.status(404).json({
      message: "No Sender or Recipient found",
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
    return res.status(200).json({
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

      const newlyCreatedChat = await Chat.findById(createdChat.id).populate(
        "users",
        "userName firstName lastName profilePic _id"
      );

      const chatWithUserPopulated = await User.populate(newlyCreatedChat, {
        path: "users",
        select: "userName firstName lastName profilePic _id",
      });
      return res.status(200).json({
        message: "Chat created and fetched successfully",
        data: createdChat,
        data2: chatWithUserPopulated,
      });
    } catch (error) {
      return res.status(404).json({
        message: "An error occured while fetching the chat",
        error,
      });
    }
  }
};
