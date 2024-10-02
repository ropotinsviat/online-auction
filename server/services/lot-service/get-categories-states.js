import con from "../../db.js";

export default async function getCategoriesAndStates() {
  const [categories] = await con.query("SELECT category FROM category");
  const [states] = await con.query("SELECT state FROM state");
  return {
    categories: categories.flatMap((c) => c.category),
    states: states.flatMap((s) => s.state),
  };
}
