import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    res.sendStatus(401);
    next();
  }

 const token = authHeader?.toString().split(" ")[1];
  if(typeof(token)=== 'string') {
      const returnedValue = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
      if(!returnedValue) {
         res.sendStatus(403);  //Invalid token was send back to the backend
     } else { 
         req.body.userEmail = typeof (returnedValue)!=='string' && returnedValue?.userEmail;
         req.body.userId = typeof (returnedValue)!=='string' && returnedValue?.userId;
         next();
      }
  } else {
    res.sendStatus(500); //No token was provided
    next()
  }

};
