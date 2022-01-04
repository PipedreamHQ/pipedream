export default {
  key: "coda_upsert-row",
  name: "Upsert a Row",
  description: "Creates a new row or updates existing rows if any upsert key columns are provided. When upserting, if multiple rows match the specified key column(s), they will all be updated with the specified value",
  version: "0.0.1",
  type: "action",
  props: {},
  async run({ $ }) {},
};
