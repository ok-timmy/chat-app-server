import express, { type Router } from "express";
import {
  createNewChat,
  fetchChatMessages,
} from "../Controllers/chatController";

const chatRouter: Router = express.Router();

//Fetch chat
chatRouter.get("/", fetchChatMessages);

// Create Chat
chatRouter.post("/", createNewChat);

export = chatRouter;
