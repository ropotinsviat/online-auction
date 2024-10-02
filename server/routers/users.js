import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const usersRouter = Router();

usersRouter.post(
  "/signup",
  body("email").isEmail(),
  body("username").isLength({ min: 3, max: 32 }),
  body("password").isLength({ min: 3, max: 32 }),
  userController.signup
);
usersRouter.post("/signin", userController.signin);
usersRouter.get("/activate/:activationLink", userController.activate);
usersRouter.get("/profile", authMiddleware, userController.getUser);
usersRouter.post("/profile", authMiddleware, userController.setUser);
usersRouter.post("/logout", authMiddleware, userController.logout);
usersRouter.post("/password-reset-link", userController.sendResetPasswordLink);
usersRouter.post("/reset-password", userController.resetPassword);
usersRouter.get("/", authMiddleware, userController.getUsers);
usersRouter.post(
  "/:userId/set-role/:role",
  authMiddleware,
  userController.setRole
);
usersRouter.get(
  "/:userId/auctions",
  authMiddleware,
  userController.getUserEnrolls
);
usersRouter.get("/:userId/lots", authMiddleware, userController.getUserLots);

export default usersRouter;
