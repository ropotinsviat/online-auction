import { Router } from "express";
import auctionController from "../controllers/auction-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const lotsRouter = Router();

lotsRouter.get("/categories-state", auctionController.getCategoriesAndStates);
lotsRouter.get(
  "/available",
  authMiddleware,
  auctionController.getAvailableLots
);
lotsRouter.get("/:lotId", auctionController.getLot);
lotsRouter.post("/add", authMiddleware, auctionController.addLot);

export default lotsRouter;
