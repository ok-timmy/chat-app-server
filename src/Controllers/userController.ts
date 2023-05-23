import { User } from "../Models/User";
import { Request, Response } from "express";


//Edit User Profile
export const editUserProfile = async (
    req: Request,
    res: Response
  ): Promise<Object> => {
    const id = { _id: req.params.id };
  
    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      })
        .select("-password")
        .select("-refreshToken");
      return res.status(200).json({
        message: "User Data Updated Successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An Error Occured",
        error,
      });
    }
  };
  
  //Update Cover Image
  export const uploadCoverImage = async (req: Request, res: Response) => {};
  
  //Update Profile Picture
  export const uploadProfilePicture = async (req: Request, res: Response) => {};
  
  //Find A user either by username or by full name
  export const findUser = async (
    req: Request,
    res: Response
  ): Promise<Object> => {
    const { userName, fullName } = req.query;
  
    let foundUsersArray: Array<Object> = [];
    try {
      if (userName) {
        const foundUsers = await User.find({ userName }).select(
          "_id userName fullName profilePic"
        );
        foundUsers.map((foundUser) => foundUsersArray.push(foundUser));
      }
      if (fullName) {
        const foundUsers = await User.find({ fullName }).select(
          "_id userName fullName profilePic"
        );
        foundUsers.map((foundUser) => foundUsersArray.push(foundUser));
      }
      return res.status(200).json({
        result: foundUsersArray,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An Error Occured, Try Again",
        error,
      });
    }
  };
  
  //Delete User Profile
  export const deleteUserProfile = async (
    req: Request,
    res: Response
  ): Promise<Object> => {
    const id = { id: req.params.id };
  
    try {
      await User.findByIdAndDelete(id);
      return res.status(200).json({
        message: "User has been successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Could Not delete User, An error occured",
      });
    }
  };
  