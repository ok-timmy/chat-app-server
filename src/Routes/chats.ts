import express, { type Router } from "express";
import {
  createNewChat,
  fetchChatMessages,
} from "../Controllers/chatController";

const chatRouter: Router = express.Router();

//Fetch chat
chatRouter.get("/chats", createNewChat);

// Create Chat
chatRouter.post("/chats", fetchChatMessages);

export = chatRouter;
