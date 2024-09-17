import { ApiError } from "../errors/api.error";
import { ITokenPair } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(
    tokenPair: ITokenPair,
    _userId: string,
  ): Promise<ITokenPair> {
    try {
      return await Token.create({ ...tokenPair, _userId: _userId });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
  public async find(token: string): Promise<void> {
    const entity = await Token.findOne({ accessToken: token });
    if (!entity) {
      throw new ApiError("Access token is not valid", 401);
    }
  }
}

export const tokenRepository = new TokenRepository();
