import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";
import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity";

import { AdStatus } from "../enums/ad/status.enum";
import { UserRole } from "../enums/user/role.enum";
import { ApiError } from "../errors/api.error";
import { adRepository } from "../repositories/ad.repository";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

class CommonMiddleware {
  public isIdValid(field: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[field];
        if (!isObjectIdOrHexString(id)) {
          throw new ApiError("Id is not valid", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);
        if (error) {
          throw new ApiError(error.message, 400);
        }
        req.body = value;
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isRoleValid() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { role } = req.body;

        if (role !== UserRole.seller && role !== UserRole.buyer) {
          return res.status(400).json({
            error: "Invalid role. Allowed roles are 'buyer' or 'seller'",
          });
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public isBodyСensorshipCheckedCreate(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const swear = matcher.hasMatch(req.body.description);
      if (swear) {
        req.body.status = AdStatus.pending;
        throw new ApiError(
          "Swear words are forbidden on our web site, please change your description",
          400,
        );
      }
      req.body.status = AdStatus.active;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async isBodyСensorshipCheckedUpdate(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await adRepository.findById(req.params.adId);
      const swear = matcher.hasMatch(req.body.description);

      if (swear && user.editCount <= 3) {
        throw new ApiError(
          "Swear words are forbidden, please change your description",
          400,
        );
      } else if (swear && user.editCount > 3) {
        req.body.status = AdStatus.pending;
        throw new ApiError(
          "Swear words are forbidden, your advertisement was blocked after 3 attempts, please ask admin for unblock",
          400,
        );
      }
      req.body.status = AdStatus.active;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
