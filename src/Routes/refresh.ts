import express, { type Router } from "express";
import refreshTokenController from "../Controllers/refreshTokenController";

const refreshRouter = express.Router();

refreshRouter.get("/refresh", refreshTokenController);

export = refreshRouter;
