import con from "../../db.js";
import ApiError from "../../exceptions/api-error.js";

export default async function markAsSent(role, paymentId) {
  if (role !== "auctioneer" && role !== "admin") throw ApiError.BadRole();
  await con.query(
    `UPDATE payment SET sending_time = NOW() WHERE payment_id = ?`,
    [paymentId]
  );
}
