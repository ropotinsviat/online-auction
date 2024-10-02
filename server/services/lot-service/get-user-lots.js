import con from "../../db.js";

export default async function getUserLots(userId) {
  const query = `
    SELECT l.lot_id AS lotId, l.lot_name AS lotName, l.image_url AS imageUrl,
      b.bid_id AS bidId, b.bid_cost AS bidCost, b.bid_time AS bidTime,
      p.payment_time AS paymentTime, p.sending_time AS sendingTime
    FROM lot l
    JOIN lotauction la ON la.lot_id = l.lot_id
    JOIN bid b ON b.lotauction_id = la.lotauction_id
    JOIN (
        SELECT b.lotauction_id, MAX(b.bid_cost) AS max_bid_cost
        FROM bid b
        GROUP BY b.lotauction_id
    ) max_bids ON max_bids.lotauction_id = b.lotauction_id AND max_bids.max_bid_cost = b.bid_cost
    JOIN auction a ON la.auction_id = a.auction_id
    LEFT JOIN payment p ON p.bid_id = b.bid_id 
    WHERE b.user_id = ? AND a.end_time < NOW()`;

  const [lots] = await con.query(query, [userId]);
  return lots;
}
