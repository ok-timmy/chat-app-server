import { Types, model, Schema } from "mongoose";


const UserSchema : Schema = new Schema(
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
    coverImage: {
      type: String,
    },
    location: {
      type: String
    },
    friends: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    sentRequests: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    accessToken: {
      type: String,
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

export const User  = model("User", UserSchema);
