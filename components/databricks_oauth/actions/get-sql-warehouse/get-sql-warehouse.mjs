import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-sql-warehouse",
  name: "Get SQL Warehouse",
  description: "Retrieves details for a specific SQL Warehouse. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/get)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    databricks_oauth,
    warehouseId: {
      description: "The ID of the SQL Warehouse to retrieve",
      propDefinition: [
        databricks_oauth,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks_oauth.getSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Retrieved details for SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },
};
