import { Router } from "express";

import { adController } from "../controllers/ad.controller";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", adController.findAll);

router.get("/:adId", commonMiddleware.isIdValid("adId"), adController.findById);

router.post(
  "/",
  // authMiddleware.checkAccessToken,
  // authMiddleware.checkAccountRole([EUserRoles.seller, EUserRoles.admin]),
  // commonMiddleware.isBodyСensorshipCheckedCreate,
  // commonMiddleware.isBodyValid(AdValidator.create),
  adController.create,
);

export const adRouter = router;
