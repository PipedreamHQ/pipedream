import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-get-sql-warehouse-config",
  name: "Get SQL Warehouse Config",
  description: "Retrieves the global configuration for SQL Warehouses. [See docs](https://docs.databricks.com/api/workspace/warehouse/get-config)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
  },
  async run({ $ }) {
    const response = await this.databricks.getSQLWarehouseConfig({ $ });
    $.export("$summary", "Successfully retrieved SQL Warehouse configuration");
    return response;
  },
};
