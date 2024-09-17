import Joi from "joi";

import { regexConstants } from "../constants/regex.constants";
import { UserAccountType } from "../enums/user/accountType.enum";
import { UserRole } from "../enums/user/role.enum";

export class UserValidator {
  static userName = Joi.string().min(3).max(30).messages({
    "string.empty": "This field is required",
    "string.min": "Name should have at least {#limit} characters",
    "string.max": "Name should have at most {#limit} characters",
  });
  static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .trim()
    .messages({
      "string.empty": "This field is required",
      "string.string.pattern.base": "Email doesn't have correct format",
    });
  static password = Joi.string().regex(regexConstants.PASSWORD).messages({
    "string.empty": "This field is required",
    "string.pattern.base":
      "Password must contain at least 8 characters, one letter, one number, and one special character",
  });
  static role = Joi.string()
    .valid(...Object.values(UserRole))
    .messages({
      "string.empty": "Role is required",
      "any.only": "Invalid role selected",
    });
  static accountType = Joi.string()
    .valid(UserAccountType)
    .when("role", {
      is: Joi.any().valid(UserRole.admin, UserRole.manager),
      then: Joi.valid(UserAccountType).default(UserAccountType.premium),
      otherwise: Joi.valid(UserAccountType).default(UserAccountType.basic),
    });

  static register = Joi.object({
    name: this.userName.required(),
    email: this.email.required(),
    password: this.password.required(),
    accountType: this.accountType,
    role: this.role.required(),
  });
  static login = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
}
