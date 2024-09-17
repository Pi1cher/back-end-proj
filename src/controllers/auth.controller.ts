import { NextFunction, Request, Response } from "express";

import { ITokenPair } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const dto = req.body as IUser;
      await authService.register(dto);
      return res
        .status(200)
        .send(`New user with email "${req.body.email}" was registered`);
    } catch (e) {
      next(e);
    }
  }
  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokenPair>> {
    try {
      const userPassword = req.res.locals.user;
      const tokensPair = await authService.login(req.body, userPassword);
      return res.status(200).json({ ...tokensPair });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  public async getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { _id: loggedUserId } = req.res.locals.Payload;
      const userProfile = await authService.getUserProfile(loggedUserId);
      return res.json(userProfile);
    } catch (e) {
      next(e);
    }
  }
  public async buyPremiumAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { _id: loggedUserId } = req.res.locals.Payload;
      const upgradedUser = await authService.buyPremiumAccount(
        loggedUserId,
        req.body,
      );
      return res.json(upgradedUser);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
