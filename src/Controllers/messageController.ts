import { Request, Response } from "express";
import { Message } from "../Models/Message";
import { User } from "../Models/User";
import { Chat } from "../Models/Chat";
import { IMessage } from "../Interfaces/message.interface";

//GET ALL MESSAGES
export const getMessages = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { chatId } = req.params;

  try {
    const messages: Array<IMessage | null> = await Message.find({
      chat: chatId,
    })
      .populate("sender", "fullName userName profilePic email ")
      .populate("chat");

    return res.status(200).json({ statusCode: 200, data: messages });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occured when fetching messages", error });
  }
};

//SEND MESSAGE
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { content, chatId, userId } = req.body;
  if (!content || !chatId) {
    // Invalid data was passed into request
    return res.status(400).json({
      message: "Content or ChatId cannot be empty",
    });
  }

  const newMessage = {
    sender: userId,
    content,
    chat: chatId,
  };

  try {
    const message = (
      await (
        await Message.create(newMessage)
      ).populate("sender", "firstName lastName userName profilePic")
    ).populate("chat");

    const messagePopulated = await User.populate(message, {
      path: "chat.users",
      select: "fullName userName profilePic email",
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: messagePopulated,
      },
      {
        new: true,
      }
    );


    return res.status(200).json({ data: messagePopulated, chat: updatedChat });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Couldn't create new chat",
      error,
    });
  }
};
