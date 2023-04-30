/*
Route to create include

post - create user
post - login user
get- get user details
put - update user details e.g profile picture
delete - user deletes their account

*/

import { Router } from "express";
// import {createUser} from "../Controllers/authController"


const {get, post, put, patch} = Router();

//Create New User 
// post("api/auth/signup", createUser)

//Login User
//post("api/auth/login", signInUser)