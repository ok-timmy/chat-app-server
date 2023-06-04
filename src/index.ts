import express, { Express, Request, Response} from "express";
const { json } = require("express");
import cors from "cors";
import dotenv from "dotenv";
import config from "./config";
import mongoose from "mongoose";
import { connectDB } from "./connectDB";
import bodyParser from "body-parser";
import {
  authRouter,
  feedsRouter,
  logoutRouter,
  messagesRouter,
  refreshRouter,
  userRouter,
  chatRouter
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
app.use("/api/chats", chatRouter)
app.use("/api/chat/messages", messagesRouter)


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
