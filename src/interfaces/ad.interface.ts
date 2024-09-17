import { Types } from "mongoose";

export interface IAd {
  _id?: Types.ObjectId | string;
  brand: string;
  model: string;
  price?: number;
  currency?: string;
  description: string;
  status?: string;
  views?: number;
  region: string;
  authorId?: Types.ObjectId | string;
  editCount?: number;
  convertedCurrencies?: {
    USD?: number;
    EUR?: number;
    UAH?: number;
  };
  currencyRate?: {
    dollarBuy?: string;
    dollarSale?: string;
    euroBuy?: string;
    euroSale?: string;
  };
}

export type IAdUpdate = Omit<IAd, "editCount">;
