import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-list-sql-warehouses",
  name: "List SQL Warehouses",
  description: "Lists all SQL Warehouses available in the Databricks workspace. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    databricks_oauth,
  },
  async run({ $ }) {
    const { warehouses } = await this.databricks_oauth.listSQLWarehouses({
      $,
    });

    if (!warehouses?.length) {
      $.export("$summary", "No warehouses found.");
      return [];
    }

    $.export("$summary", `Successfully retrieved ${warehouses.length} warehouse${warehouses.length === 1
      ? ""
      : "s"}.`);

    return warehouses;
  },
};
