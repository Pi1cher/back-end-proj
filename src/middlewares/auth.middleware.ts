import { NextFunction, Request, Response } from "express";

import { TokenType } from "../enums/token/tokenType.enum";
import { UserAccountType } from "../enums/user/accountType.enum";
import { UserRole } from "../enums/user/role.enum";
import { ApiError } from "../errors/api.error";
import { Ad } from "../models/ad.model";
import { User } from "../models/user.model";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const bearerToken = req.get("Authorization");
      const accessToken = bearerToken.split("Bearer ")[1];
      if (!accessToken) {
        throw new ApiError("No access token in storage", 401);
      }
      const payload = tokenService.checkToken(accessToken, TokenType.Access);
      await tokenRepository.find(accessToken);
      req.res.locals.Payload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkAuthorId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { _id: loggedUserId } = req.res.locals.Payload;
      const adId = req.params.adId;
      const ad = await Ad.findById(adId);
      if (!ad) {
        throw new ApiError("Advertisement was not found", 404);
      }

      if (ad.authorId.toString() !== loggedUserId) {
        throw new ApiError("You are not authorized of this advertisement", 403);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkAccountType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { _id: loggedUserId } = req.res.locals.Payload;
      const user = await User.findOne({ _id: loggedUserId });
      if (!user) {
        throw new ApiError("User not found", 422);
      }
      if (user.accountType === UserAccountType.basic) {
        throw new ApiError(
          "You don't have rights to get this information. Please buy premium account",
          403,
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  }
  public checkAccountRole(allowedRoles: UserRole[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { _id: loggedUserId } = req.res.locals.Payload;
        const { role: userRole } = await User.findOne({ _id: loggedUserId });
        if (!userRole) {
          throw new ApiError("User not found", 422);
        }
        if (!userRole || !allowedRoles.includes(userRole as UserRole)) {
          throw new ApiError("Access denied", 403);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
