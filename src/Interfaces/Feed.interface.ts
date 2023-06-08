import { Document, Types } from "mongoose";

export interface IFeed extends Document{
    feedImage?: string;
    content: string;
    numberOfLikes?: number;
    numberOfShares?: number;
    likes?: Array<Types.ObjectId>;
    comments?: Array<Types.ObjectId>;
    author: Types.ObjectId;
  }