/*

What to create in a feed 

- poster - point to a user (userName, id, profilePicture)
- feed Image - image
- feed content - content
- likes - number of likes (saves Id and username of users that likes post)
- number of shares (saves just the ids of people that share)
-comments - points to the comment model

*/

import { Types, model, Schema } from "mongoose";

const feedSchema = new Schema(
  {
    feedImage: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    numberOfShares: {
      type: Number,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Feed", feedSchema);
