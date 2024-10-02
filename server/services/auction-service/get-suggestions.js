import con from "../../db.js";

export default async function getSuggestions(searchTerm) {
  const [rows] = await con.query(
    `SELECT auction_name AS auctionName FROM auction 
     WHERE LOWER(auction_name) LIKE ? AND end_time > NOW() LIMIT 6`,
    [`%${searchTerm.toLowerCase()}%`]
  );

  return rows.map((row) => row.auctionName);
}
