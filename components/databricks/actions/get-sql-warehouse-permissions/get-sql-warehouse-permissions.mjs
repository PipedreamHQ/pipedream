import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-get-sql-warehouse-permissions",
  name: "Get SQL Warehouse Permissions",
  description: "Retrieves the permissions for a specific SQL Warehouse. [See docs](https://docs.databricks.com/api/workspace/warehouses/getpermissions)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of the SQL Warehouse to fetch permissions for",
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
