import { Document, Types } from "mongoose";

export interface IChat extends Document {
    chatName?: string,
    users: Array<Types.ObjectId>,
    latestMessages: Array<Types.ObjectId>
  }