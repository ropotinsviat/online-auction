import con from "../../db.js";

export default async function getEnrolls(userId) {
  const [auctions] = await con.query(
    `SELECT a.auction_id AS auctionId,
      a.auction_name AS auctionName,
      a.start_time AS startTime,
      a.end_time AS endTime
    FROM auction a
    JOIN userauction ua ON a.auction_id = ua.auction_id
    WHERE ua.user_id = ? AND a.end_time > NOW()`,
    [userId]
  );
  return auctions;
}
