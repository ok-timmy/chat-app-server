import { Request, Response } from "express";
import { User } from "../Models/User";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import config from "../config";
import { IUser } from "../Interfaces/user.interface";

const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.sendStatus(401);
  } else {
    const refreshToken = cookies.jwt;
    const foundUser: IUser | null = await User.findOne({ refreshToken });

    if (!foundUser) {
      return res.sendStatus(403);
    }

    const returnValue = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    console.log(returnValue, "Return Value");

    if (!returnValue) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(
      {
        email: returnValue,
      },
      config.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "200m",
      }
    );
    return res.json({ accessToken });
  }
};

export default refreshTokenController;
