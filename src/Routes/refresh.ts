import { Router } from "express";
import refreshTokenController from "../Controllers/refreshTokenController";

const {get} = Router();

get("/refresh", refreshTokenController)