import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-list-sql-warehouses",
  name: "List SQL Warehouses",
  description: "Lists all SQL Warehouses available in the Databricks workspace. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/list)",
  version: "0.0.2",
  type: "action",
  props: {
    databricks,
  },
  async run({ $ }) {
    const { warehouses } = await this.databricks.listSQLWarehouses({
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
