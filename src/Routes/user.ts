import express, {type Router } from "express";
import { deleteUserProfile, editUserProfile, findUser } from '../Controllers/userController';

const userRouter = express.Router();

//Edit User Details
userRouter.put("/:id", editUserProfile);

//Delete User
userRouter.delete("/:id", deleteUserProfile);

//Find User by username or first Name or Last Name
userRouter.get("/find/?username=detail&fullName=detail", findUser);


export = userRouter;