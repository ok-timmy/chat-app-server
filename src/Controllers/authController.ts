import { Jwt, sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { User } from "../Models/User";
import { Request, Response } from "express";
import { config } from "dotenv";
const salt = 10;

config();

//Create a new user
exports.createUser = async (req: Request, res: Response): Promise<Object> => {
  const { body } = req;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check If User already exist and return appropriate error.
  const checkUserExist = await User.findOne({ email: body.email });
  if (checkUserExist) {
    return res
      .status(409)
      .json({ statusCode: 409, message: "This Email Already exists" });
  }

  try {
    const { email, password, userName, firstName, lastName } = body;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      hashedPassword,
      userName,
      firstName,
      lastName,
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
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "12000s" }
        );

        const refreshToken = sign(
          { userEmail: foundUser.email },
          process.env.REFRESH_TOKEN_SECRET,
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
): Promise<Object> => {};

//Delete User Profile
exports.deleteUserProfile = async (
  req: Request,
  res: Response
): Promise<boolean> => {};

