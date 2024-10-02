import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function addLot(
  role,
  name,
  state,
  description,
  image,
  categories
) {
  if (role !== "auctioneer" && role !== "admin") throw ApiError.BadRole();

  const [res] = await con.query(
    `INSERT INTO lot (lot_name, state_id, description, image_url)
   SELECT ?, state_id, ?, ?
   FROM state
   WHERE state = ?`,
    [name, description, image, state]
  );

  if (!res.affectedRows) throw ApiError.BadRequest("Could not create the lot!");

  const lotId = res.insertId;

  const placeholders = categories.map(() => "?").join(",");

  const query = `INSERT INTO lotcategory (lot_id, category_id)
      SELECT ?, c.category_id
      FROM category c
      WHERE c.category IN (${placeholders})`;

  await con.query(query, [lotId, ...categories]);
}
