import {Schema, model, Types} from 'mongoose';

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Users",
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
    timestamps: true
  }
);

module.exports = model("Message", MessageSchema);
