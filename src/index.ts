import express, { Express, Request, Response } from "express";
const { json } = require("express");
import cors from "cors";
import dotenv from "dotenv";
import config from "./config";
import mongoose from "mongoose";
import { connectDB } from "./connectDB";
import { Socket } from "socket.io";
import bodyParser from "body-parser";
import {
  authRouter,
  feedsRouter,
  logoutRouter,
  messagesRouter,
  refreshRouter,
  userRouter,
  chatRouter,
} from "./Routes/index";
import verifyJWT from "./Middlewares/verifyToken";

const app: Express = express();

dotenv.config();
app.use(cors());
app.use(json({ extended: false }));

const port = config.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/feeds", feedsRouter);

// app.use(verifyJWT);
app.use("/api/user", userRouter);
app.use("/api/refresh", refreshRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/chats", chatRouter);
app.use("/api/chat/messages", messagesRouter);

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 120000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("Connected to socketio");

  //SIGN UP SOCKET
  socket.on("Sign Up", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit(`${userData.firstName} Signed Up`);
  });

  //LOGIN SOCKET
  socket.on("Sign In", (userData) => {
    socket.join(userData);
    console.log(userData._id);
    socket.emit(`${userData.userName} logged in to his account`);
  });

  //CREATE CHAT SOCKET
  socket.on(
    "Chat With someone",
    (chatId: string, senderId: string, recepientId: string) => {
      socket.join(chatId);
      console.log(chatId);
      socket.emit(`${senderId} opened a chat with ${recepientId}`);
    }
  );

  //SEND A MESSAGE
  socket.on("Send a message to somone", (message) => {
    console.log(message);
    socket.send(message);

    const chat = message.chat;

    if (!chat.users) {
      return console.log("users not defined");
    }

    chat.users.forEach((user: any) => {
      if (user._id === message.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", message);
    });
    socket.emit(
      `${message.sender._id} sent a message with content ${message}}`
    );
  });

  //SEND A FRIEND REQUEST
  socket.on(
    "Sent a friend request",
    (senderId: string, recipientId: string) => {
      socket.send("Request sent");
      console.log("Friend request sent");
      socket.emit(`${senderId} sent a request to ${recipientId}`);
    }
  );

  //ACCEPT A FRIEND REQUEST
  socket.on(
    "Friend Request accepted",
    (senderId: string, recipientId: string) => {}
  );
});
