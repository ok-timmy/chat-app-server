import express, {type Router } from "express";
import { getMessages, sendMessage } from "../Controllers/messageController";

const messagesRouter = express.Router();

messagesRouter.get("/:chatId", getMessages);

messagesRouter.post("/api/messages", sendMessage)

export = messagesRouter;