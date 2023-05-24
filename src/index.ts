import express, { Express, Request, Response } from "express";
const { json } = require("express");
import cors from "cors";
import dotenv from "dotenv";
import config from "./config";
import mongoose from "mongoose";
import { connectDB } from "./connectDB";
import { routes } from "./Routes";
import bodyParser from "body-parser";

const app: Express = express();

dotenv.config();
app.use(cors());
app.use(json({ extended: false }));

const port = config.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

connectDB();

// app.use("/", routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
