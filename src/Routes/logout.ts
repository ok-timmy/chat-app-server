import { Router } from "express";
import { logOutUser } from "../Controllers/logoutController";

const { get } = Router();

get("/logout", logOutUser);
