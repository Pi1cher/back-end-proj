import { Types } from "mongoose";

export interface IMessage {
  header: string;
  content: string;
  send_by: Types.ObjectId;
  send_to: Types.ObjectId;
}
