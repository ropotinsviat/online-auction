import { verifyToken, signToken } from "../services/token-service.js";
import ApiError from "../exceptions/api-error.js";
import con from "../db.js";

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (token) {
      const { userId } = verifyToken(token);

      const [users] = await con.query(
        `SELECT role
        FROM user
        JOIN role ON user.role_id = role.role_id
        WHERE user_id = ?`,
        [userId]
      );

      if (!users.length)
        return next(ApiError.BadRequest("User was not found!"));

      req.userId = userId;
      req.role = users[0].role;

      const newToken = signToken(userId);

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });

      return next();
    }
  } catch (e) {}
  return next(ApiError.BadRequest("Not authenticated!"));
}
