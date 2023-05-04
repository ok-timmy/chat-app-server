import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { User } from "../Models/User";
import { Request, Response } from "express";
import config from "../config";
const salt = 10;


//Create a new user
exports.createUser = async (req: Request, res: Response): Promise<Object> => {
  const { email, password, userName, firstName, lastName  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check If User already exist and return appropriate error.
  const checkUserExist = await User.findOne({ email });
  if (checkUserExist) {
    return res
      .status(409)
      .json({ statusCode: 409, message: "This Email Already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      hashedPassword,
      userName,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
    });
    await newUser.save();
    console.log("User Created Successfully!");
    return res.status(200).json({
      status: 200,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An Error Occoured",
      errorMessage: error,
    });
  }
};

//Login User
exports.signInUser = async (req: Request, res: Response): Promise<Object> => {
  const { userName, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Check if userName does not exist
    const foundUser = await User.findOne({ email: req.body.email });
    // console.log(foundUser);
    if (foundUser) {
      // console.log("User was found");
      const validate = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (validate) {
        const accessToken = sign(
          { username: foundUser.email },
          config.ACCESS_TOKEN_SECRET,
          { expiresIn: "12000s" }
        );

        const refreshToken = sign(
          { userEmail: foundUser.email },
          config.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        // console.log("Refresh Token updated", refreshToken)

        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          // sameSite: "None",
          // secure: true,  This has to be in production mode
        });

        const { _id, email, firstName, lastName, userName, bio, profilePic } =
          foundUser;
        // console.log("Logged In User already", accessToken)
        return res.status(200).json({
          _id,
          email,
          firstName,
          lastName,
          userName,
          bio,
          profilePic,
          accessToken,
        });
      } else {
        return res.status(401).json({ error: "Incorrect Password" });
      }
    } else {
      // console.log("User Was not found");
      return res.status(401).send({ message: "User does not exist" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured",
      errorMessage: error,
    });
  }
};

//Edit User Profile
exports.editUserProfile = async (
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

//Find A user either by username or by full name
exports.findUser = async (req: Request, res: Response): Promise<Object> => {
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
exports.deleteUserProfile = async (
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
