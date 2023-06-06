import express, { type Router } from "express";
import { getMessages, sendMessage } from "../Controllers/messageController";

const messagesRouter: Router = express.Router();

//FETCH MESSAGES
messagesRouter.get("/:chatId", getMessages);

//SEND MESSAGE
messagesRouter.post("/", sendMessage);

export = messagesRouter;
