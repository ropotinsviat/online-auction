import con from "../../db.js";

export default async function enroll(userId, auctionId) {
  await con.query(
    `INSERT INTO userauction (user_id, auction_id) VALUES (?, ?)`,
    [userId, auctionId]
  );
}
