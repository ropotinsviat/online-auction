import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function addAuction(
  role,
  name,
  startTime,
  endTime,
  entryFee,
  lots
) {
  if (role !== "auctioneer" && role !== "admin") throw ApiError.BadRole();
  if (!lots.length) throw ApiError.BadRequest("Choose lots for the auction!");

  const [res] = await con.query(
    `INSERT INTO auction (auction_name, start_time, end_time, enter_cost)
        VALUES (?, ?, ?, ?)`,
    [name, startTime, endTime, entryFee]
  );

  const auctionId = res.insertId;

  const values = lots.map(() => "(?, ?, ?)").join(", ");
  const query = `
        INSERT INTO lotauction (lot_id, auction_id, start_cost)
        VALUES ${values}`;

  await con.query(
    query,
    lots.flatMap((lot) => [lot.lotId, auctionId, lot.startingPrice])
  );
}
