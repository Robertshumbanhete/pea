try {
  const sql_1 = "empty;";
  const parameters_1 = [];
  const results = await conn.db_conn(sql_1, parameters_1);

  return results;
} catch (error) {
  console.log(error);
  return undefined;
}
