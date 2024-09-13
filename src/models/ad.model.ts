import { model, Schema } from "mongoose";

import { AdCurrency } from "../enums/ad/currency.enum";
import { AdEditCount } from "../enums/ad/editCount.enum";
import { AdStatus } from "../enums/ad/status.enum";

const adSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: {
      value: { type: Number, required: true },
      currency: { type: String, enum: AdCurrency, required: true },
      exchangeRate: { type: Number, required: true },
    },
    description: { type: String, required: true },
    status: { type: String, enum: AdStatus, default: AdStatus.pending },
    views: { type: Number, default: 0 },
    region: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    editCount: { type: Number, enum: AdEditCount, default: AdEditCount.zero },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Ad = model("ad", adSchema);
