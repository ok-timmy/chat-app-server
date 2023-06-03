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
} from "../Controllers/feedsController";

const feedsRouter = express.Router()


// Get All Feeds
feedsRouter.get("api/feeds/all", getAllFeeds);

//Create Feed
feedsRouter.post("/api/feed/create", createFeed);

//Edit Feed
feedsRouter.put("api/feed/edit/:id", editFeed);

//Delete Feed
feedsRouter.delete("api/feed/delete/:id", deleteFeed);

//Like Feed
feedsRouter.patch("api/feed/like/:postId/:userId", likeFeed);

//Share Feed
feedsRouter.patch("api/feed/share/:postId", shareFeed);

//Comment On Feed
feedsRouter.post("api/feed/comment/:postId/:userId", postComment);


export = feedsRouter;