import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-stop-sql-warehouse",
  name: "Stop SQL Warehouse",
  description: "Stops a SQL Warehouse by ID. [See the documentation](https://docs.databricks.com/api/workspace/warehouse/stop)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of the SQL Warehouse to stop",
    },
  },
  async run({ $ }) {
    const response = await this.databricks.stopSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Successfully stopped SQL Warehouse with ID ${this.warehouseId}`);
    return response;
  },
};
