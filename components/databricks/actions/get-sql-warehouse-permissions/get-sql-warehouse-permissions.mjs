import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-get-sql-warehouse-permissions",
  name: "Get SQL Warehouse Permissions",
  description: "Retrieves the permissions for a specific SQL Warehouse. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/getpermissions)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    databricks,
    warehouseId: {
      description: "The ID of the SQL Warehouse to fetch permissions for",
      propDefinition: [
        databricks,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks.getSQLWarehousePermissions({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Retrieved permissions for SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },
};
