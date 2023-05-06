import { Request, Response } from "express";
import { Message } from "../Models/Message";
import { User } from "../Models/User";
import { Chat } from "../Models/Chat";

//GET ALL MESSAGES
export const getMessages = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "fullName userName profilePic email ")
      .populate("chat");

    return res.sendStatus(200).json({ statusCode: 200, data: messages });
  } catch (error) {
    return res
      .sendStatus(500)
      .json({ message: "An error occured when fetching messages", error });
  }
};

//SEND MESSAGE
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    // Invalid data was passed into request
    return res.sendStatus(400).json({
      message: "Content or ChatId cannot be empty",
    });
  }

  const newMessage = {
    sender: req.body.userId,
    content,
    chat: chatId,
  };

  try {
    const message = (
      await (
        await Message.create(newMessage)
      ).populate("sender", "firstName profilePic")
    ).populate("chat");

    const messagePopulated = await User.populate(message, {
      path: "chat.users",
      select: "fullName, userName, profilePic, email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessages: messagePopulated,
    });

    return res.sendStatus(200).json({ data: messagePopulated });
  } catch (error) {
    return res.sendStatus(400).json({
      message: "Couldn't create new chat",
      error,
    });
  }
};
