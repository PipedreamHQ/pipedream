import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-list-sql-warehouses",
  name: "List SQL Warehouses",
  description: "Lists all SQL Warehouses available in the Databricks workspace. [See the documentation](https://docs.databricks.com/api/workspace/warehouse/list)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of warehouses to return",
      default: 50,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.maxResults || 50,
    };

    const { warehouses } = await this.databricks.listSQLWarehouses({
      params,
      $,
    });

    if (!warehouses?.length) {
      $.export("$summary", "No warehouses found.");
      return [];
    }

    $.export("$summary", `Successfully retrieved ${warehouses.length} warehouse${warehouses.length === 1 ? "" : "s"}.`);

    return warehouses;
  },
};
