import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config';
import mongoose from 'mongoose';
import { connectDB } from './connectDB';

const app: Express = express();

dotenv.config();
app.use(cors())

const port = config.PORT || 8080;


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

connectDB();

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});