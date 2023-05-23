import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  signInUser,
  signinWithGoogle,
} from "../Controllers/authController";

const { get, post, put, patch } = Router();

// Create New User
post(
  "api/auth/signup",
  check("email", "Please Enter A Valid email").isEmail(),
  check("password", "A Valid Password Is Required").exists(),
  createUser
);

//Login User
post("api/auth/login", signInUser);

//Login Using Google 
post("api/auth/signInWithGoogle", signinWithGoogle)
