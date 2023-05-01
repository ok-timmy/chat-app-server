import { Types, model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type:String,
    }, 
    
    bio: { type: String },
    profilePic: {
      type: String,
      default:
        "https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg",
    },
    friend: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequest: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    sentRequest: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    accessToken: {
      type: String
    },
    refreshToken: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", UserSchema);
module.exports = User;
