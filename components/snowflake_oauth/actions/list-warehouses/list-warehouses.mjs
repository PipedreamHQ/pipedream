import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  key: "snowflake_oauth-list-warehouses",
  name: "List Warehouses",
  description: "List the warehouses available to the connected Snowflake account. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/show-warehouses)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    snowflake,
  },
  async run({ $ }) {
    const warehouses = await this.snowflake.listWarehouses();
    const names = warehouses.map((i) => i.name);
    $.export("$summary", `Successfully retrieved ${names.length} warehouse${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
