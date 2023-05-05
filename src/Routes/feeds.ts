/*

**Maybe** Include a feature where a feed poster only allows people who are their friends comment

*/

import { Router } from "express";
import {
  createFeed,
  getAllFeeds,
  editFeed,
  deleteFeed,
  likeFeed,
  shareFeed,
  postComment,
} from "../Controllers/feedsController";

const { get, post, put, patch } = Router();

// Get All Feeds
get("api/feeds/all", getAllFeeds);

//Create Feed
post("/api/feed/create", createFeed);

//Edit Feed
put("api/feed/edit/:id", editFeed);

//Delete Feed
Router().delete("api/feed/delete/:id", deleteFeed);

//Like Feed
patch("api/feed/like/:postId/:userId", likeFeed);

//Share Feed
patch("api/feed/share/:postId", shareFeed);

//Comment On Feed
post("api/feed/comment/:postId/:userId", postComment);
