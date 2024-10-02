import jwt from "jsonwebtoken";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION * 1000,
  });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export { signToken, verifyToken };
