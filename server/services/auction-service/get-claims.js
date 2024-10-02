import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function getClaims(role) {
  if (role !== "auctioneer" && role !== "admin") throw ApiError.BadRole();

  const query = `
    SELECT l.lot_id AS lotId, l.lot_name AS lotName, l.image_url AS imageUrl,
      l.description, st.state, la.start_cost AS startCost, 
      b.bid_id AS bidId, b.bid_cost AS bidCost, b.bid_time AS bidTime,
      p.payment_id AS paymentId, p.payment_time AS paymentTime, p.sending_time AS sendingTime,
      u.user_name AS userName, u.email, u.phone, u.address
    FROM lot l
    JOIN state st ON st.state_id = l.state_id
    JOIN lotauction la ON la.lot_id = l.lot_id
    JOIN bid b ON b.lotauction_id = la.lotauction_id
    JOIN (
        SELECT b.lotauction_id, MAX(b.bid_cost) AS max_bid_cost
        FROM bid b
        GROUP BY b.lotauction_id
    ) max_bids ON max_bids.lotauction_id = b.lotauction_id AND max_bids.max_bid_cost = b.bid_cost
    JOIN auction a ON la.auction_id = a.auction_id
    JOIN user u ON u.user_id = b.user_id
    LEFT JOIN payment p ON p.bid_id = b.bid_id 
    WHERE a.end_time < NOW() AND (p.payment_id IS NULL OR p.sending_time IS NULL)`;

  const [claims] = await con.query(query);
  return claims;
}
