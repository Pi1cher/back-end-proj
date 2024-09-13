import { UserAccountType } from "../enums/user/accountType.enum";
import { ApiError } from "../errors/api.error";
import { ICredentials } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async create(data: IUser, hashedPassword: string): Promise<IUser> {
    try {
      return await User.create({ ...data, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async find(credentials: ICredentials): Promise<IUser> {
    try {
      return await User.findOne({ email: credentials.email });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async findById(loggedUserId: string): Promise<IUser> {
    try {
      return await User.findOne({ _id: loggedUserId });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async upgradeAccount(id: string): Promise<IUser> {
    const upgradedUser = await User.findOneAndUpdate(
      { _id: id },
      { accountType: UserAccountType.premium },
      { returnDocument: "after" },
    );
    return upgradedUser;
  }
}
export const userRepository = new UserRepository();
