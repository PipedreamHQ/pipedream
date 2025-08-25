import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-set-sql-warehouse-config",
  name: "Set SQL Warehouse Config",
  description: "Updates the global configuration for SQL Warehouses. [See docs](https://docs.databricks.com/api/workspace/warehouses/setworkspacewarehouseconfig)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    config: {
      type: "object",
      label: "Configuration",
      description: "The configuration object for SQL Warehouses. Example: `{ \"enable_serverless_compute\": true }`",
    },
  },
  async run({ $ }) {
    const response = await this.databricks.setSQLWarehouseConfig({
      data: this.config,
      $,
    });

    $.export("$summary", "Successfully updated SQL Warehouse configuration");
    return response;
  },
};
