import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-stop-sql-warehouse",
  name: "Stop SQL Warehouse",
  description: "Stops a SQL Warehouse by ID. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/stop)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks_oauth,
    warehouseId: {
      description: "The ID of the SQL Warehouse to stop",
      propDefinition: [
        databricks_oauth,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks_oauth.stopSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Successfully stopped SQL Warehouse with ID ${this.warehouseId}`);
    return response;
  },
};
