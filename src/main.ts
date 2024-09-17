import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { config } from "./configs/configs";
import { adRouter } from "./routers/ad.router";
import { authRouter } from "./routers/auth.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ads", adRouter);
app.use("/auth", authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  return res.status(status).json({
    message: err.message,
    status: err.status,
  });
});

app.listen(config.APP_PORT, async () => {
  await mongoose.connect(config.MONGO_URL);
  console.log(`Server has started on PORT ${config.APP_PORT}`);
});
