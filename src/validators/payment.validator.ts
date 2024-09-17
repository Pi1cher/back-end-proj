import Joi from "joi";

export class PaymentValidator {
  static card = Joi.string().messages({
    "string.empty": "This field is required",
  });
  static amount = Joi.number();
  static buyPremium = Joi.object({
    card: this.card.required(),
    amount: this.amount.required(),
  });
}
