import ApiError from "../exceptions/api-error.js";
import userService from "../services/user-service.js";
import { validationResult } from "express-validator";
import getEnrolls from "../services/auction-service/get-enrolls.js";
import getUserLots from "../services/lot-service/get-user-lots.js";

class UserController {
  async signup(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return next(ApiError.BadRequest("Validation error!", errors.array()));
      const { email, username, password } = req.body;
      await userService.signup(username, email, password);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async signin(req, res, next) {
    try {
      const { nameOrEmail, password } = req.body;
      const { token } = await userService.signin(nameOrEmail, password);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const { activationLink } = req.params;
      await userService.activate(activationLink);
      res.cookie("token", activationLink, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });
      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUser(req.userId);
      res.send({ user });
    } catch (e) {
      next(e);
    }
  }

  async setUser(req, res, next) {
    try {
      const { name, phone, address } = req.body;
      await userService.setUser(req.userId, name, phone, address);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async sendResetPasswordLink(req, res, next) {
    try {
      const { email } = req.body;
      await userService.sendResetPasswordLink(email);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await userService.resetPassword(token, password);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("token", { httpOnly: true, secure: true });
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { nameOrEmail } = req.query;
      const users = await userService.getUsers(req.role, nameOrEmail);
      res.send({ users });
    } catch (e) {
      next(e);
    }
  }

  async setRole(req, res, next) {
    try {
      const { userId, role } = req.params;
      await userService.setRole(req.role, role, userId);
      res.end();
    } catch (e) {
      next(e);
    }
  }

  async getUserLots(req, res, next) {
    try {
      if (
        req.userId != req.params.userId &&
        req.role !== "auctioneer" &&
        req.role !== "admin"
      )
        throw ApiError.BadRole();
      const lots = await getUserLots(req.userId);
      res.send({ lots });
    } catch (e) {
      next(e);
    }
  }

  async getUserEnrolls(req, res, next) {
    try {
      if (
        req.userId != req.params.userId &&
        req.role !== "auctioneer" &&
        req.role !== "admin"
      )
        throw ApiError.BadRole();
      const auctions = await getEnrolls(req.userId);
      res.send({ auctions });
    } catch (e) {
      next(e);
    }
  }
}

const userController = new UserController();
export default userController;
