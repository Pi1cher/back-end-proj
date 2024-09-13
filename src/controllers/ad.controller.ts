import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { IAd } from "../interfaces/ad.interface";
import { adService } from "../services/ad.service";

class AdController {
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IAd[]>> {
    try {
      const ads = await adService.findAll();
      return res.json(ads);
    } catch (e) {
      next(e);
    }
  }
  public async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IAd>> {
    try {
      const ad = await adService.findById(req.params.adId);
      const adWithUpdatedViews = await adService.updateViewsById(
        ad._id as string,
      );

      return res.json(adWithUpdatedViews);
    } catch (e) {
      next(e);
    }
  }
  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const { _id } = req.res.locals.Payload;
      if (!_id) {
        throw new ApiError("Id of logged user wasn't found", 400);
      }
      const ad = await adService.create(req.body, _id);
      return res.status(201).json(ad);
    } catch (e) {
      next(e);
    }
  }
  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IAd>> {
    try {
      const updatedAd = await adService.updateById(
        req.params.adId,
        req.body as IAd,
      );

      return res.status(200).json(updatedAd);
    } catch (e) {
      next(e);
    }
  }
  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await adService.deleteById(req.params.adId);

      return res
        .status(200)
        .send(`Advertisement "${req.params.adId}" was deleted successfully`);
    } catch (e) {
      next(e);
    }
  }
  public async getAdViewsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<number>> {
    try {
      const adId = req.params.adId;

      const { views: adViews } = await adService.findById(adId);
      return res.status(200).json(adViews);
    } catch (e) {
      next(e);
    }
  }

  public async findAveragePriceInRegion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<number>> {
    try {
      const adId = req.params.adId;
      const adInfo = await adService.findById(adId);
      const averagePrice = await adService.findInRegion(adInfo);

      return res.status(200).json(averagePrice);
    } catch (e) {
      next(e);
    }
  }
  public async findAveragePriceInUkraine(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<number>> {
    try {
      const adId = req.params.adId;
      const adInfo = await adService.findById(adId);
      const averagePrice = await adService.findInUkraine(adInfo);

      return res.status(200).json(averagePrice);
    } catch (e) {
      next(e);
    }
  }
}

export const adController = new AdController();
