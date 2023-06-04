import { Document, Types } from "mongoose";

export interface IComment extends Document {
    commenter: Types.ObjectId,
    postId: string,
    content: string
  }
  