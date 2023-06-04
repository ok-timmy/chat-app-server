import { Request, Response } from "express";
import { User } from "../Models/User";
import { IUser } from "../Interfaces/user.interface";

export const logOutUser = async (
  req: Request,
  res: Response
): Promise<Object> => {
  const cookies = req.cookies;
  if (!cookies) {
    return res.status(204).json({ message: "No cookie found" });
  } else {
    const userRefreshToken = cookies.jwt;
    const foundUser: IUser | null = await User.findOne({
      refreshToken: userRefreshToken,
    });

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
    }

    await User.findOneAndUpdate(
      { refreshToken: userRefreshToken },
      {
        refreshToken: "",
      },
      { new: true }
    );
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }
};
