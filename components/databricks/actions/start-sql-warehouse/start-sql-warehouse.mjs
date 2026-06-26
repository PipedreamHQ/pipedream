import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-start-sql-warehouse",
  name: "Start SQL Warehouse",
  description: "Starts a SQL Warehouse by ID. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/start)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks,
    warehouseId: {
      description: "The ID of the SQL Warehouse to start",
      propDefinition: [
        databricks,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks.startSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Successfully started SQL Warehouse with ID ${this.warehouseId}`);
    return response;
  },
};
