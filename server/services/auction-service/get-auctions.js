import con from "../../db.js";

const sorts = [
  "",
  " ORDER BY entryCost ASC ",
  " ORDER BY entryCost DESC ",
  " ORDER BY startTime ASC ",
  " ORDER BY startTime DESC ",
  " ORDER BY lotsAmount ASC ",
  " ORDER BY lotsAmount DESC ",
  " ORDER BY usersEnrolled ASC ",
  " ORDER BY usersEnrolled DESC ",
];

const dateFilters = {
  0: " a.end_time > NOW()",
  1: " a.start_time < NOW() AND a.end_time > NOW() ",
  2: " a.start_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY) ",
  3: " a.start_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY) ",
  4: " a.start_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 60 DAY) ",
};

export default async function getAuctions(name, sort, minCost, maxCost, date) {
  const params = [];
  let query = `
      SELECT a.auction_id AS auctionId, 
        a.auction_name AS auctionName, 
        a.start_time AS startTime, 
        a.end_time AS endTime,
        a.enter_cost AS entryCost,
        COUNT(DISTINCT l.lot_id) AS lotsAmount,
        COUNT(DISTINCT ua.userauction_id) AS usersEnrolled,
        GROUP_CONCAT(DISTINCT l.image_url SEPARATOR '|') AS images
      FROM auction a
      LEFT JOIN lotauction la ON la.auction_id = a.auction_id
      LEFT JOIN lot l ON l.lot_id = la.lot_id
      LEFT JOIN userauction ua ON ua.auction_id = a.auction_id
      WHERE a.end_time > NOW()`;

  if (name) {
    query += " AND a.auction_name LIKE ?";
    params.push(`%${name}%`);
  }

  query += " AND a.enter_cost BETWEEN ? AND ?";
  params.push(minCost, maxCost);

  if (date && dateFilters[date]) query += ` AND ${dateFilters[date]}`;

  query += " GROUP BY a.auction_id";

  if (sorts[sort]) query += sorts[sort];

  const [auctions] = await con.query(query, params);

  return { auctions };
}
