import { Router } from "express";

import { adController } from "../controllers/ad.controller";
import { UserRole } from "../enums/user/role.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { AdValidator } from "../validators/ad.validator";

const router = Router();

router.get("/", adController.findAll);

router.get("/:adId", commonMiddleware.isIdValid("adId"), adController.findById);

router.get(
  "/:adId/views-statistics",
  commonMiddleware.isIdValid("adId"),
  authMiddleware.checkAccessToken,
  authMiddleware.checkAccountRole([
    UserRole.seller,
    UserRole.manager,
    UserRole.admin,
  ]),
  authMiddleware.checkAuthorId,
  authMiddleware.checkAccountType,
  adController.getAdViewsById,
);
router.get(
  "/:adId/average-price-region",
  authMiddleware.checkAccessToken,
  authMiddleware.checkAccountRole([
    UserRole.seller,
    UserRole.manager,
    UserRole.buyer,
    UserRole.admin,
  ]),
  authMiddleware.checkAuthorId,
  authMiddleware.checkAccountType,
  adController.findAveragePriceInRegion,
);
router.get(
  "/:adId/average-price-ukraine",
  authMiddleware.checkAccessToken,
  authMiddleware.checkAccountRole([
    UserRole.seller,
    UserRole.manager,
    UserRole.buyer,
    UserRole.admin,
  ]),
  authMiddleware.checkAuthorId,
  authMiddleware.checkAccountType,
  adController.findAveragePriceInUkraine,
);

router.post(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.checkAccountRole([UserRole.seller, UserRole.admin]),
  commonMiddleware.isBodyСensorshipCheckedCreate,
  commonMiddleware.isBodyValid(AdValidator.create),
  adController.create,
);

router.put(
  "/:adId",
  authMiddleware.checkAccessToken,
  authMiddleware.checkAccountRole([UserRole.seller, UserRole.admin]),
  authMiddleware.checkAuthorId,
  commonMiddleware.isIdValid("adId"),
  commonMiddleware.isBodyСensorshipCheckedUpdate,
  commonMiddleware.isBodyValid(AdValidator.update),
  adController.updateById,
);

router.delete(
  "/:adId",
  authMiddleware.checkAccessToken,
  authMiddleware.checkAccountRole([
    UserRole.seller,
    UserRole.manager,
    UserRole.admin,
  ]),
  authMiddleware.checkAuthorId,
  commonMiddleware.isIdValid("adId"),
  adController.deleteById,
);

export const adRouter = router;
