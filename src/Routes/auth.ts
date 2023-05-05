import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  deleteUserProfile,
  editUserProfile,
  findUser,
  signInUser,
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

//Edit User Details
put("api/user/:id", editUserProfile);

//Delete User
Router().delete("api/user/:id", deleteUserProfile);

//Find User by username or first Name or Last Name
get("api/user/find/?username=detail&fullName=detail", findUser);
