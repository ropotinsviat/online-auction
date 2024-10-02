import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function getAuction(auctionId) {
  let query = `
      SELECT a.*, 
          u.user_id, u.user_name, 
          l.lot_id, l.lot_name, l.image_url, 
          la.start_cost, 
          max_bids.max_bid_cost AS last_bid_cost
      FROM auction a
      LEFT JOIN userauction ua ON a.auction_id = ua.auction_id
      LEFT JOIN user u ON ua.user_id = u.user_id
      LEFT JOIN lotauction la ON a.auction_id = la.auction_id
      LEFT JOIN lot l ON la.lot_id = l.lot_id
      LEFT JOIN (
          SELECT b.lotauction_id, MAX(b.bid_cost) AS max_bid_cost
          FROM bid b
          GROUP BY b.lotauction_id
      ) max_bids ON max_bids.lotauction_id = la.lotauction_id
      WHERE a.auction_id = ?`;

  const [res] = await con.query(query, [auctionId]);

  if (!res.length) throw ApiError.BadRequest("Auction was not found!");

  const auction = {
    auctionId: res[0].auction_id,
    auctionName: res[0].auction_name,
    startTime: res[0].start_time,
    endTime: res[0].end_time,
    entryFee: res[0].enter_cost,
    users: [],
    lots: [],
  };

  res.forEach((row) => {
    if (
      row.user_id &&
      !auction.users.some((user) => user.userId === row.user_id)
    )
      auction.users.push({ userId: row.user_id, userName: row.user_name });

    if (row.lot_id)
      if (!auction.lots.find((lot) => lot.lotId === row.lot_id))
        auction.lots.push({
          lotId: row.lot_id,
          lotName: row.lot_name,
          imageUrl: row.image_url,
          currentCost: row.last_bid_cost
            ? Number(row.last_bid_cost) + Number(row.start_cost) * 0.05
            : Number(row.start_cost),
        });
  });

  return auction;
}
