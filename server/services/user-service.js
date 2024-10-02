import ApiError from "../exceptions/api-error.js";
import mailService from "./mail-service.js";
import { signToken, verifyToken } from "./token-service.js";
import bcrypt from "bcryptjs";
import con from "../db.js";

class UserService {
  async signup(name, email, password) {
    const [users] = await con.query(
      `SELECT * FROM user WHERE user_name = ? OR email = ?`,
      [name, email]
    );

    if (users.length > 0)
      if (!users[0].confirmed)
        await con.query(`DELETE FROM user WHERE user_id = ?`, [
          users[0].user_id,
        ]);
      else
        throw ApiError.BadRequest(
          "User with this name or email already exists!"
        );

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await con.query(
      `INSERT INTO user (user_name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );

    const token = signToken(result.insertId);
    const activationLink = `${process.env.SERVER_URL}/users/activate/${token}`;
    await mailService.sendActivationMail(email, activationLink);
  }

  async signin(nameOrEmail, password) {
    const [users] = await con.query(
      `SELECT *, role.role 
        FROM user  
        JOIN role ON user.role_id = role.role_id
        WHERE user_name = ? OR email = ?`,
      [nameOrEmail, nameOrEmail]
    );

    if (users.length === 0) throw ApiError.BadRequest("User was not found!");

    let user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw ApiError.BadRequest("Invalid password!");
    if (!user.confirmed)
      throw ApiError.BadRequest("Email hasn't been confirmed!");

    const token = signToken(user.user_id);

    user = {
      userId: user.user_id,
      username: user.user_name,
      email: user.email,
      role: user.role,
    };

    return { user, token };
  }

  async activate(token) {
    const { userId } = verifyToken(token);
    await con.query(`UPDATE user SET confirmed = 1 WHERE user_id = ?`, [
      userId,
    ]);
  }

  async sendResetPasswordLink(email) {
    const [users] = await con.query(
      `SELECT user_id FROM user WHERE email = ?`,
      [email]
    );

    if (!users.length)
      throw ApiError.BadRequest("User with this email was not found!");

    const token = signToken(users[0].user_id);
    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await mailService.sendResetLinkMail(email, link);
  }

  async resetPassword(token, password) {
    const { userId } = verifyToken(token);

    if (typeof password !== "string" || password.length < 5)
      throw ApiError.BadRequest("Password is too short");

    const hashedPassword = await bcrypt.hash(password, 10);
    await con.query(`UPDATE user SET password = ? WHERE user_id = ?`, [
      hashedPassword,
      userId,
    ]);
  }

  async getUser(userId) {
    const [users] = await con.query(
      `SELECT *, role.role 
        FROM user  
        JOIN role ON user.role_id = role.role_id
        WHERE user_id = ?`,
      [userId]
    );

    if (users.length === 0) throw ApiError.BadRequest("User was not found!");

    if (!users[0].confirmed)
      throw ApiError.BadRequest("Email hasn't been confirmed!");

    const user = {
      userId: users[0].user_id,
      userName: users[0].user_name,
      email: users[0].email,
      phone: users[0].phone,
      address: users[0].address,
      role: users[0].role,
    };

    return user;
  }

  async setUser(userId, name, phone, address) {
    validateName(name);
    if (phone) validatePhone(phone);

    await con.query(
      `UPDATE user SET user_name = ?, phone = ?, address = ? WHERE user_id = ?`,
      [name, phone, address, userId]
    );
  }

  async getUsers(role, nameOrEmail) {
    if (role !== "admin") throw ApiError.BadRole();

    const [users] = await con.query(
      `SELECT u.user_id AS userId, u.user_name AS name, u.email, u.phone, r.role 
      FROM user u  
      JOIN role r ON u.role_id = r.role_id
      WHERE u.user_name LIKE ? OR u.email LIKE ?`,
      [`%${nameOrEmail}%`, `%${nameOrEmail}%`]
    );
    return users;
  }

  async setRole(role, newUserRole, userId) {
    if (role !== "admin") throw ApiError.BadRole();

    await con.query(
      `UPDATE user 
      SET role_id = (SELECT role_id FROM role WHERE role = ?)
      WHERE user_id = ?`,
      [newUserRole, userId]
    );
  }
}

function validateName(name) {
  if (typeof name !== "string")
    throw ApiError.BadRequest("Name is not a string!");
  if (name.trim().length < 5) throw ApiError.BadRequest("Name is too short!");
  if (name.trim().length > 255) throw ApiError.BadRequest("Name is too long!");
}

function validatePhone(phone) {
  if (typeof phone !== "string")
    throw ApiError.BadRequest("Phone is not a string!");
  if (phone.trim().length < 8) throw ApiError.BadRequest("Phone is too short!");
  if (phone.trim().length > 14) throw ApiError.BadRequest("Phone is too long!");
  if (!/^[0-9+()\- ]+$/.test(phone))
    throw ApiError.BadRequest("Phone must contain only numbers!");
}

const userService = new UserService();
export default userService;
