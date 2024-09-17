import Joi from "joi";

import { regexConstants } from "../constants/regex.constants";

export class PaymentValidator {
  static card = Joi.string().regex(regexConstants.CARD).messages({
    "string.empty": "This field is required",
    "string.pattern.base": "Wrong card format",
  });
  static amount = Joi.number();
  static buyPremium = Joi.object({
    card: this.card.required(),
    amount: this.amount.required(),
  });
}
