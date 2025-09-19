import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-get-sql-warehouse",
  name: "Get SQL Warehouse",
  description: "Retrieves details for a specific SQL Warehouse. [See docs](https://docs.databricks.com/api/workspace/warehouses/get)",
  version: "0.0.4",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      description: "The ID of the SQL Warehouse to retrieve",
      propDefinition: [
        databricks,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks.getSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Retrieved details for SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },
};
