import { Document, Types } from "mongoose";

export interface IMessage extends Document {
    sender: Types.ObjectId,
    content: Types.ObjectId,
    chat: Types.ObjectId
  }