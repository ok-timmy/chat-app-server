import express, { type Router } from "express";
import {
  deleteUserProfile,
  editUserProfile,
  findUser,
} from "../Controllers/userController";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getFriends,
  sendFriendRequest,
  unFriend,
} from "../Controllers/requestsController";

const userRouter: Router = express.Router();

//Edit User Details
userRouter.put("/:id", editUserProfile);

//Delete User
userRouter.delete("/:id", deleteUserProfile);

//Find User by username or first Name or Last Name
userRouter.get("/find", findUser);

//Get all Friends
userRouter.get("/allFriends", getFriends)

//Accept Friend Request
userRouter.post("/acceptRequest", acceptFriendRequest);

//Send Friend Request
userRouter.post("/sendRequest", sendFriendRequest);

//Remove a friend
userRouter.post("/unfriend", unFriend);

//Delete Friend Request
userRouter.post("/removeFriendRequest", deleteFriendRequest);



export = userRouter;
