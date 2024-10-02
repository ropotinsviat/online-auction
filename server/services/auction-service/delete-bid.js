import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function deleteBid(role, bidId) {
  if (role !== "auctioneer" && role !== "admin") throw ApiError.BadRole();
  await con.query(
    `DELETE FROM bid WHERE bid_id = ? 
    AND NOT EXISTS (
      SELECT 1
      FROM payment
      WHERE payment.bid_id = bid.bid_id)`,
    [bidId]
  );
}
