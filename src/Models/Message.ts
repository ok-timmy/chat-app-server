import { Schema, model, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

export const Message = model("Message", MessageSchema);
