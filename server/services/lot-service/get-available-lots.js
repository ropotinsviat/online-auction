import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function getAvailableLots(role) {
  if (role !== "auctioneer" && role !== "admin") throw ApiError.BadRole();

  const [lots] = await con.query(
    `SELECT l.lot_id AS lotId, st.state, l.lot_name AS lotName 
    FROM lot l
    JOIN state st ON st.state_id = l.state_id 
    LEFT JOIN lotauction la ON l.lot_id = la.lot_id
    LEFT JOIN bid b ON b.lotauction_id = la.lotauction_id
    LEFT JOIN auction a ON a.auction_id = la.auction_id
    WHERE b.lotauction_id IS NULL
    AND (la.auction_id IS NULL OR (a.end_time < NOW() AND a.auction_id = (
      SELECT MAX(a2.auction_id)
      FROM auction a2
      JOIN lotauction la2 ON la2.auction_id = a2.auction_id
      WHERE la2.lot_id = l.lot_id )))`
  );

  return lots;
}
