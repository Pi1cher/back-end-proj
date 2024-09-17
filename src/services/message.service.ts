import { Types } from "mongoose";

import Message from "../models/message.model";

class MessageService {
  public async sendMessage(
    senderUserId: Types.ObjectId,
    header: string,
    content: string,
    recipientUserId: Types.ObjectId,
  ): Promise<any> {
    const newMessage = await Message.create({
      header,
      content,
      send_to: recipientUserId,
      send_by: senderUserId,
    });

    return newMessage;
  }
}

export const messageService = new MessageService();
