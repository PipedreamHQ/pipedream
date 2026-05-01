import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-start-sql-warehouse",
  name: "Start SQL Warehouse",
  description: "Starts a SQL Warehouse by ID. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/start)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks_oauth,
    warehouseId: {
      description: "The ID of the SQL Warehouse to start",
      propDefinition: [
        databricks_oauth,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks_oauth.startSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Successfully started SQL Warehouse with ID ${this.warehouseId}`);
    return response;
  },
};
