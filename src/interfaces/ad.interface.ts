import { Types } from "mongoose";

export interface IAd {
  _id?: Types.ObjectId | string;
  brand: string;
  model: string;
  price?: {
    value: number;
    currency: string;
    exchangeRate: number;
  };
  description: string;
  status?: string;
  views?: number;
  region: string;
  authorId?: Types.ObjectId | string;
  editCount?: number;
}

export type IAdUpdate = Omit<IAd, "editCount">;
