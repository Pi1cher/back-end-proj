import Joi from "joi";

import { AdCurrency } from "../enums/ad/currency.enum";
import { AdEditCount } from "../enums/ad/editCount.enum";
import { AdRegion } from "../enums/ad/region.enum";
import { AdStatus } from "../enums/ad/status.enum";
import { CarBrand } from "../enums/cars/brand.enum";
import { CarModel } from "../enums/cars/model.enum";

export class AdValidator {
  static brand = Joi.string()
    .valid(...Object.values(CarBrand))
    .messages({
      "any.only": "Invalid car brand selected, please ask admin for help",
    });
  static model = Joi.string()
    .valid(...Object.values(CarModel))
    .messages({
      "any.only": "Invalid car model selected, please ask admin for help",
    });
  static price = Joi.number().min(0).messages({
    "any.only": "Invalid car price",
  });
  static currency = Joi.string()
    .valid(...Object.values(AdCurrency))
    .messages({ "any.only": "Invalid currency" });
  static description = Joi.string();
  static status = Joi.string()
    .valid(...Object.values(AdStatus))
    .default(AdStatus.pending);
  static views = Joi.number().default(0);
  static region = Joi.string().valid(...Object.values(AdRegion));

  static authorId = Joi.string().hex();
  static editCount = Joi.number()
    .valid(...Object.values(AdEditCount))
    .default(AdEditCount.zero);

  static create = Joi.object({
    brand: this.brand.required(),
    model: this.model.required(),
    price: this.price,
    currency: this.currency,
    description: this.description.required(),
    status: this.status,
    region: this.region.required(),
    authorId: this.authorId,
    editCount: this.editCount,
  });
  static update = Joi.object({
    brand: this.brand,
    model: this.model,
    price: this.price,
    currency: this.currency,
    description: this.description,
    region: this.region,
    status: this.status,
    editCount: this.editCount,
  });
}
