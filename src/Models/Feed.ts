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
    },
    content: {
      type: String,
      required: true,
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    numberOfShares: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    author: [{
      type: Types.ObjectId,
      ref: "User"
    }
    ]
  },
  {
    timestamps: true,
  }
);

export const Feed = model("Feed", feedSchema);
module.exports = Feed;
