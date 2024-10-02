import { Router } from "express";
import auctionController from "../controllers/auction-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const auctionRouter = Router();

auctionRouter.get("/suggestions", auctionController.getSuggestions);
auctionRouter.get("/", auctionController.getAuctions);
auctionRouter.get("/:auctionId", auctionController.getAuction);
auctionRouter.post(
  "/enroll/:auctionId",
  authMiddleware,
  auctionController.enroll
);
auctionRouter.post("/add", authMiddleware, auctionController.addAuction);

export default auctionRouter;
