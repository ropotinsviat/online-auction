import getAuctions from "../services/auction-service/get-auctions.js";
import getAuction from "../services/auction-service/get-auction.js";
import getSuggestions from "../services/auction-service/get-suggestions.js";
import enroll from "../services/auction-service/enroll.js";
import bid from "../services/auction-service/bid.js";
import getEnrolls from "../services/auction-service/get-enrolls.js";
import getAvailableLots from "../services/lot-service/get-available-lots.js";
import getLot from "../services/lot-service/get-lot.js";
import payForLot from "../services/lot-service/pay-for-lot.js";
import getCategoriesAndStates from "../services/lot-service/get-categories-states.js";
import addLot from "../services/lot-service/add-lot.js";
import addAuction from "../services/auction-service/add-auction.js";
import getClaims from "../services/auction-service/get-claims.js";
import deleteBid from "../services/auction-service/delete-bid.js";
import markAsSent from "../services/auction-service/mark-as-sent.js";

class AuctionController {
  async getAuctions(req, res, next) {
    try {
      const { name, sort, minCost, maxCost, date } = req.query;
      const data = await getAuctions(name, sort, minCost, maxCost, date);
      res.send(data);
    } catch (e) {
      next(e);
    }
  }

  async getAuction(req, res, next) {
    try {
      const { auctionId } = req.params;
      const auction = await getAuction(auctionId);
      res.send({ auction });
    } catch (e) {
      next(e);
    }
  }

  async getSuggestions(req, res, next) {
    try {
      const { searchTerm } = req.query;
      const auctionsNames = await getSuggestions(searchTerm);
      res.send({ auctionsNames });
    } catch (e) {
      next(e);
    }
  }

  async enroll(req, res, next) {
    try {
      await enroll(req.userId, req.params.auctionId);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async bid(req, res, next) {
    try {
      await bid(req.params.lotId, req.userId, req.body.bidCost);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async getClaims(req, res, next) {
    try {
      const claims = await getClaims(req.role);
      res.send({ claims });
    } catch (e) {
      next(e);
    }
  }

  async payForLot(req, res, next) {
    try {
      await payForLot(req.params.bidId);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async getCategoriesAndStates(req, res, next) {
    try {
      const categoriesAndStates = await getCategoriesAndStates();
      res.send(categoriesAndStates);
    } catch (e) {
      next(e);
    }
  }

  async addLot(req, res, next) {
    try {
      const { name, state, description, categories } = req.body;
      await addLot(
        req.role,
        name,
        state,
        description,
        "https://picsum.photos/200?random=11", // stub
        categories
      );
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async addAuction(req, res, next) {
    try {
      const { name, startTime, endTime, entryFee, lots } = req.body;
      await addAuction(req.role, name, startTime, endTime, entryFee, lots);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async getAvailableLots(req, res, next) {
    try {
      const lots = await getAvailableLots(req.role);
      res.send({ lots });
    } catch (e) {
      next(e);
    }
  }

  async deleteBid(req, res, next) {
    try {
      await deleteBid(req.role, req.params.bidId);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async markAsSent(req, res, next) {
    try {
      await markAsSent(req.role, req.params.paymentId);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async getLot(req, res, next) {
    try {
      const lot = await getLot(req.params.lotId);
      res.send({ lot });
    } catch (e) {
      next(e);
    }
  }
}

const auctionController = new AuctionController();
export default auctionController;
