import { Router } from "express";
import { deleteUserProfile, editUserProfile, findUser } from '../Controllers/userController';

  const { get, put, patch } = Router();


//Edit User Details
put("api/user/:id", editUserProfile);

//Delete User
Router().delete("api/user/:id", deleteUserProfile);

//Find User by username or first Name or Last Name
get("api/user/find/?username=detail&fullName=detail", findUser);
