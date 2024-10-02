import con from "../../db.js";

export default async function payForLot(bidId) {
  await con.query(`INSERT INTO payment (bid_id) VALUES (?)`, [bidId]);
}
