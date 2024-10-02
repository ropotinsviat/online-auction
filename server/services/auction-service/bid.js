import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";
import mailService from "../mail-service.js";

export default async function bid(lotId, userId, bidCost) {
  const query = `
    SELECT a.start_time, a.end_time, 
      l.lot_name, l.lot_id, 
      ua.user_id, 
      la.start_cost, la.lotauction_id,
      max_bids.max_bid_cost, max_bids.max_bid_user_id,
      bidder.email
    FROM lot l 
    JOIN lotauction la ON la.lot_id = l.lot_id
    JOIN auction a ON a.auction_id = la.auction_id
    LEFT JOIN userauction ua ON ua.auction_id = a.auction_id
    LEFT JOIN (
        SELECT b1.lotauction_id, b1.user_id AS max_bid_user_id, b1.bid_cost AS max_bid_cost
        FROM bid b1
        JOIN (
            SELECT lotauction_id, MAX(bid_cost) AS max_bid_cost
            FROM bid
            GROUP BY lotauction_id
        ) b2 ON b1.lotauction_id = b2.lotauction_id AND b1.bid_cost = b2.max_bid_cost
    ) max_bids ON max_bids.lotauction_id = la.lotauction_id
    LEFT JOIN user bidder ON max_bids.max_bid_user_id = bidder.user_id
    WHERE l.lot_id = ? AND a.end_time > NOW()`;

  const [rows] = await con.query(query, [lotId]);

  if (!rows.length)
    throw ApiError.BadRequest("Could not find an auction for the lot!");
  if (!rows.some((row) => row.user_id === userId))
    throw ApiError.BadRequest("Please enroll in the auction to place a bid!");
  if (new Date(rows[0].start_time) > new Date())
    throw ApiError.BadRequest("The auction hasn't started yet!");
  if (new Date(rows[0].end_time) < new Date())
    throw ApiError.BadRequest("The auction is over now!");

  const minBidCost = rows[0].max_bid_cost
    ? Number(rows[0].max_bid_cost) + Number(rows[0].start_cost) * 0.05
    : Number(rows[0].start_cost);

  if (bidCost < minBidCost)
    throw ApiError.BadRequest("The bid is too small! Try to reload the page!");

  await con.query(
    `INSERT INTO bid (lotauction_id, bid_cost, user_id)
    VALUES (?, ?, ?)`,
    [rows[0].lotauction_id, bidCost, userId]
  );
  if (rows[0].email)
    await mailService.sendBidLost(
      rows[0].email,
      rows[0].lot_name,
      rows[0].lot_id
    );
}
