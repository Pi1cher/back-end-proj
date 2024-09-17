import * as jwt from "jsonwebtoken";

import { config } from "../configs/configs";
import { TokenType } from "../enums/token/tokenType.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
  }
  public checkToken(token: string, type: TokenType): ITokenPayload {
    try {
      let secret;
      switch (type) {
        case TokenType.Access:
          secret = config.JWT_ACCESS_SECRET;
          break;
        case TokenType.Refresh:
          secret = config.JWT_REFRESH_SECRET;
          break;
      }
      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token is not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
