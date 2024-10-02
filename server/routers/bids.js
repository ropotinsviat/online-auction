import { Router } from "express";
import auctionController from "../controllers/auction-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const bidsRouter = Router();

bidsRouter.post("/add/:lotId", authMiddleware, auctionController.bid);
bidsRouter.post("/:bidId/pay", authMiddleware, auctionController.payForLot);
bidsRouter.delete("/:bidId", authMiddleware, auctionController.deleteBid);

export default bidsRouter;
