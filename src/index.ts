import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app: Express = express();

dotenv.config();
app.use(cors())

const port = 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});