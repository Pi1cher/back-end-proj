import { NextFunction, Request, Response } from "express";

import { messageService } from "../services/message.service";

class MessageController {
  public async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { header, content, recipientUserId } = req.body;

      const senderUserId = res.locals._id;

      const newMessage = await messageService.sendMessage(
        senderUserId,
        header,
        content,
        recipientUserId,
      );

      return res.status(201).json({ message: newMessage });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Failed to send message" });
      next(e);
    }
  }
}

export const messageController = new MessageController();
