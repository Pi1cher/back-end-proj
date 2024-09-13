import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId | string;
  name: string;
  email: string;
  password: string;
  accountType?: string;
  role: string;
}
1