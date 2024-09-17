import express from "express";

import { messageController } from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/send",
  authMiddleware.checkAccessToken,
  messageController.sendMessage,
);

export const messageRouter = router;
