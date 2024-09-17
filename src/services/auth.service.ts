import { UserAccountType } from "../enums/user/accountType.enum";
import { ApiError } from "../errors/api.error";
import { IPaymentForPremium } from "../interfaces/premium.interface";
import { ICredentials, ITokenPair } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: IUser): Promise<IUser> {
    try {
      const hashedPassword = await passwordService.hash(dto.password);
      return await userRepository.create(dto, hashedPassword);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async login(
    credentials: ICredentials,
    user: IUser,
  ): Promise<ITokenPair> {
    try {
      const isMatched = await passwordService.compare(
        credentials.password,
        user.password,
      );
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }
      const tokenPair = await tokenService.generateTokenPair({
        _id: user._id,
        name: user.name,
      });
      await tokenRepository.create(tokenPair, user._id);
      return tokenPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async getUserProfile(loggedUserId: string): Promise<IUser> {
    try {
      return await userRepository.findById(loggedUserId);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async buyPremiumAccount(
    loggedUserId: string,
    payment: IPaymentForPremium,
  ): Promise<IUser> {
    try {
      const user = await userRepository.findById(loggedUserId);
      if (user.accountType === UserAccountType.premium) {
        throw new ApiError("User already has a premium account", 400);
      }
      if (payment.amount < 200) {
        throw new ApiError(
          "Price of premium account - 200 UAH. Please replenish your card",
          400,
        );
      }
      return await userRepository.upgradeAccount(user._id);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
