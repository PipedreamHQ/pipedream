import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-sql-warehouse-config",
  name: "Get SQL Warehouse Config",
  description: "Retrieves the global configuration for SQL Warehouses. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/getworkspacewarehouseconfig)",
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
    const response = await this.databricks_oauth.getSQLWarehouseConfig({
      $,
    });
    $.export("$summary", "Successfully retrieved SQL Warehouse configuration");
    return response;
  },
};
