/*

**Maybe** Include a feature where a feed poster only allows people who are their friends comment

*/

import express, {type Router } from "express";
import {
  createFeed,
  getAllFeeds,
  editFeed,
  deleteFeed,
  likeFeed,
  shareFeed,
  postComment,
  getSingleUserFeed,
} from "../Controllers/feedsController";

const feedsRouter = express.Router()


// Get All Feeds
feedsRouter.get("/all", getAllFeeds);

//Fetch all Posts made by a single user
feedsRouter.get("/:id", getSingleUserFeed)

//Create Feed
feedsRouter.post("/create", createFeed);

//Edit Feed
feedsRouter.put("/edit/:id", editFeed);

//Delete Feed
feedsRouter.delete("/delete/:id", deleteFeed);

//Like Feed
feedsRouter.patch("/like/:postId/:userId", likeFeed);

//Share Feed
feedsRouter.patch("/share/:postId", shareFeed);

//Comment On Feed
feedsRouter.post("/comment/:postId", postComment);


export = feedsRouter;