import { Router } from "express";
import auctionController from "../controllers/auction-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const claimsRouter = Router();

claimsRouter.get("/", authMiddleware, auctionController.getClaims);
claimsRouter.post(
  "/:paymentId/send",
  authMiddleware,
  auctionController.markAsSent
);

export default claimsRouter;
