import { Router } from "express";
import usersRouter from "./users.js";
import auctionsRouter from "./auctions.js";
import lotsRouter from "./lots.js";
import bidsRouter from "./bids.js";
import claimsRouter from "./claims.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/auctions", auctionsRouter);
router.use("/lots", lotsRouter);
router.use("/bids", bidsRouter);
router.use("/claims", claimsRouter);

export default router;
