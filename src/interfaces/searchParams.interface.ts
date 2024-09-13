import { Types } from "mongoose";

export interface SearchParams {
  region?: string;
  brand?: string;
  model?: string;
  price?: {
    value?: number;
    currency?: string;
    exchangeRate?: number;
  };
  description?: string;
  status?: string;
  views?: number;
  authorId?: Types.ObjectId | string;
}
