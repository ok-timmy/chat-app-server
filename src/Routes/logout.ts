import express, {type Router } from "express";
import { logOutUser } from "../Controllers/logoutController";

const logoutRouter = express.Router()

logoutRouter.get("/logout", logOutUser);

export = logoutRouter
