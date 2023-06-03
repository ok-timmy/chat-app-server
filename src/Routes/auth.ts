import express, { type Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  signInUser,
  signinWithGoogle,
} from "../Controllers/authController";

const authRouter: Router = express.Router();


// Create New User
authRouter.post(
  "/signup",
  [
  check("email", "Please Enter A Valid email").isEmail(),
  check("password", "A Valid Password Is Required").exists(),
  ],
  createUser
);

//Login User
authRouter.post("/login", signInUser);

//Login Using Google
authRouter.post("/signInWithGoogle", signinWithGoogle);


export = authRouter;
