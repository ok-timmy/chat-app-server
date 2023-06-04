import { Document } from "mongoose"

export interface IUser extends Document {
    email: string,
    password: string,
    userName: string,
    firstName: string,
    lastName: string,
    fullName: string,
    bio: string,
    profilePic: string,
    coverImage?: string,
    location: string,
    accessToken: string,
    refreshToken?: string,
    friends: Array<any>,
    friendRequest : Array<any>
    sentRequest: Array<any>
  
  }