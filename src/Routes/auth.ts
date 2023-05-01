/*
Route to create include

post - create user
post - login user
get- get user details
put - update user details e.g profile picture
delete - user deletes their account

*/

import { Router } from "express";
import { check } from "express-validator";
// import {createUser} from "../Controllers/authController"

const { get, post, put, patch } = Router();

//Create New User
// post(
//   "api/auth/signup",
//   check("email", "Please Enter A Valid email").isEmail(),
//   check("password", "A Valid Password Is Required").exists(),
//   createUser
// );

//Login User
//post("api/auth/login", signInUser)

//Edit User Details
// put("api/user/:id", editUserProfile)

//Delete User
// Router().delete("api/user/:id", deleteUser)

//Find User by username or first Name or Last Name
// get("api/user/find/?username=detail&fullName=detail", findUser)
