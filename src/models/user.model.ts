import { model, Schema } from "mongoose";

import { UserAccountType } from "../enums/user/accountType.enum";
import { UserRole } from "../enums/user/role.enum";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    accountType: {
      type: String,
      enum: UserAccountType,
      default: UserAccountType.basic,
    },
    role: { type: String, enum: UserRole, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.pre("save", function (next) {
  if (this.role === UserRole.admin || UserRole.manager) {
    this.accountType = UserAccountType.premium;
  } else {
    this.accountType = UserAccountType.basic;
  }
  next();
});

export const User = model("user", userSchema);
