import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function getLot(lotId) {
  const query = `
    SELECT l.lot_id, l.lot_name, l.image_url,
      l.description, st.state, c.category, la.start_cost, 
      b.bid_id, b.bid_cost, b.bid_time, u.user_name,
      a.*
    FROM lot l
    JOIN state st ON st.state_id = l.state_id
    LEFT JOIN lotcategory lc ON lc.lot_id = l.lot_id 
    LEFT JOIN category c ON c.category_id = lc.category_id
    JOIN lotauction la ON la.lot_id = l.lot_id
    LEFT JOIN bid b ON b.lotauction_id = la.lotauction_id
    JOIN auction a ON la.auction_id = a.auction_id
    LEFT JOIN user u ON u.user_id = b.user_id
    WHERE l.lot_id = ? AND a.auction_id = (
      SELECT MAX(a2.auction_id)
      FROM auction a2
      JOIN lotauction la2 ON la2.auction_id = a2.auction_id
      WHERE la2.lot_id = l.lot_id )
    ORDER BY b.bid_cost DESC`;

  const [lots] = await con.query(query, [lotId]);

  if (!lots.length) throw ApiError.BadRequest("Could not find the lot!");

  const lot = {
    lotId: lots[0].lot_id,
    lotName: lots[0].lot_name,
    imageUrl: lots[0].image_url,
    description: lots[0].description,
    state: lots[0].state,
    startCost: lots[0].start_cost,
    currentCost: lots[0].start_cost,
    auctionId: lots[0].auction_id,
    auctionName: lots[0].auction_name,
    bids: [],
    categories: [],
  };

  lots.forEach((row) => {
    if (row.category && !lot.categories.includes(row.category))
      lot.categories.push(row.category);

    if (row.bid_id && !lot.bids.find((bid) => bid.bidId === row.bid_id))
      lot.bids.push({
        bidId: row.bid_id,
        bidCost: row.bid_cost,
        bidTime: row.bid_time,
        userName: row.user_name,
      });
  });

  if (lot.bids.length)
    lot.currentCost =
      Number(lot.bids[0].bidCost) + Number(lot.startCost) * 0.05;

  return lot;
}
