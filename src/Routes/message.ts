import { Router } from "express";
import { getMessages, sendMessage } from "../Controllers/messageController";

const {get, post} = Router();

get("api/messages/:chatId", getMessages);

post("api/messages", sendMessage)