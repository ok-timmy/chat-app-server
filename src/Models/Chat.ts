import {Schema, Types, model} from "mongoose";


const ChatSchema = new Schema({
    chatName: {
        type: String,
        trim: true,
      },
      users: [
        {
          type: Types.ObjectId,
          ref: "User",
        },
      ],
      latestMessage: [{
        type: Types.ObjectId,
        ref: "Message",
      }],
    },
    {
      timestamps: true,
    }
)

export const Chat = model("Chat", ChatSchema)