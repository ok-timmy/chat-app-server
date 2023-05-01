/*

Point to a post - via its id
comment content
commenter

**Maybe**
Response(s) to comment too will be added and that will be an array of comments that point to this comment 
as parent comment

*/

import { Schema, Types, model } from "mongoose";

const CommentSchema = new Schema(
  {
    commenter: {
      type: Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: Types.ObjectId,
      ref: "Feed",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model("Comment", CommentSchema);
module.exports = Comment;
