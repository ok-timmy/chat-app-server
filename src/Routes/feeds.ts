/*
Routes to create

post - create feed (user must be authenticated to call this)
get - get all feeds and arrange by most recent
delete - delete feed
put - update feed (for delete and update, only creators of feed can call those requests)
put - update like number and array of users who have liked for feed
put - update share number for feed
put - comment on feed


**Maybe** Include a feature where a feed poster only allows people who are their friends comment

*/

import { Router } from "express";

const {get, post, put, patch} = Router();

// Get All Feeds
// get("api/feeds/all", getAllFeeds)

//Create Feed
// post("/api/feed/create", createFeed)

//Edit Feed
// put("api/feed/edit/:id", editFeed)

//Delete Feed
// Router().delete("api/feed/delete/:id", deleteFeed)

//Like Feed
// patch("api/feed/like/:postId/:userId", likeFeed)

//Share Feed
// patch("api/feed/share/:postId", shareFeed)

//Comment On Feed
// post("api/feed/comment/:postId/:userId", commentOnFeed)