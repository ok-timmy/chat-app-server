import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { User } from "../Models/User";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import config from "../config";
import { IUser } from "../Interfaces/user.interface";
const salt = 10;

//Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { email, password, userName, firstName, lastName } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check If User already exist and return appropriate error.
  const checkUserExist: IUser|null = await User.findOne({email: email});
  console.log('line 24', checkUserExist);
  if (checkUserExist) {
    return res
      .status(409)
      .json({ statusCode: 409, message: "This Email Already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword);
    const newUser = new User({
      email,
      password: hashedPassword,
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
export const signInUser = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const { userName, password } = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Check if userName does not exist
    const foundUser: IUser|null = await User.findOne({ userName: userName });

    if (foundUser) {
      // console.log("User was found");
      const validate = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (validate) {
        const accessToken = sign(
          { userEmail: foundUser.email },
          config.ACCESS_TOKEN_SECRET,
          { expiresIn: "12000s" }
        );

        const refreshToken = sign(
          { userEmail: foundUser.email, userId: foundUser._id },
          config.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        // console.log("Refresh Token updated", refreshToken)

        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          // sameSite: "none",
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
      return res.status(400).send({ message: "User does not exist" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An Error Occured",
      errorMessage: error,
    });
  }
};

//SIGN IN WITH GOOGLE ACCOUNT
export const signinWithGoogle = async (req: Request, res: Response) => {
  const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: config.GOOGLE_CLIENT_ID })
    .then(async (response: any) => {
      //Check if the user gmail is verified and get details
      const { email_verified, name, email, profilePic } = response?.payload;

      //If email is verified, proceed to find the user in the database
      if (email_verified) {
        // Check if the user already exist in the database

        const foundUser: IUser|null = await User.findOne({ email });
        // If user is found Log the user in instead
        if (foundUser) {
          //Destructure all what you need from the user details now
          const { _id, firstName, lastName, email, profilePic } = foundUser;

          const accessToken = sign(
            { userEmail: email },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: "12000s" }
          );

          const refreshToken = sign(
            { userEmail: email, userId: _id },
            config.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          foundUser.refreshToken = refreshToken;
          await foundUser.save();
          // console.log("Refresh Token updated", refreshToken)
          // console.log(result);
          // console.log(userRoles);

          // Creates Secure Cookie with refresh token
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // sameSite: "none",
            // secure: true,  This has to be in production mode
          });

          // Send authorization roles and access token to user
          return res.json({
            _id,
            email,
            firstName,
            lastName,
            profilePic,
            accessToken,
          });
        } else {
          // If user is not found create a new user and save to the database using the details gotten from the user google account
          const password: string = email + config.SECRET_HASH;
          const firstName: string = name.split(" ")[0];
          const lastName: string = name.split(" ")[1];

          const hashedPassword = await bcrypt.hash(password, salt);

          const newUser = new User({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            fullName: `${firstName} ${lastName}`,
            profilePic: profilePic,
          });

          newUser
            .save()
            .then(async (data) => {
              //Destructure all what you need from the user details now
              const { _id, firstName, lastName, email, profilePic } = newUser;

              const accessToken = sign(
                { userEmail: email },
                config.ACCESS_TOKEN_SECRET,
                { expiresIn: "12000s" }
              );

              const refreshToken = sign(
                { userEmail: email, userId: _id },
                config.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
              );

              newUser.refreshToken = refreshToken;
              await newUser.save();

              // Creates Secure Cookie with refresh token
              res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                // secure: true,
                // sameSite: "none"  This should be done in production mode,
              });

              // Send authorization roles and access token to user
              return res.json({
                _id,
                email,
                firstName,
                lastName,
                profilePic,
                accessToken,
              });
            })
            .catch((err) => {
              // Catch the error that occurs in saving the user to the database
              return res.status(401).json({
                statusCode: 401,
                message: "Signup error",
              });
            });
        }
      } else {
        // At this point, it means the call to sign in using gmail account failed so just return a status 400 to them
        return res.status(400).json({
          statusCode: 400,
          message: "Google Login Failed. Try Again",
        });
      }
    })
    .catch((error) => {
      return res.status(400).json({
        statusCode: 400,
        message: "Error occured while verifying Id Token",
      });
    });
};
