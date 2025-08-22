import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-set-sql-warehouse-permissions",
  name: "Set SQL Warehouse Permissions",
  description: "Updates the permissions for a specific SQL Warehouse. [See docs](https://docs.databricks.com/api/workspace/warehouse/set-permissions)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of the SQL Warehouse to update permissions for",
    },
    permissions: {
      type: "object",
      label: "Permissions",
      description: "The permissions object. Example: `{ \"access_control_list\": [{ \"user_name\": \"alice@example.com\", \"permission_level\": \"CAN_MANAGE\" }] }`",
    },
  },
  async run({ $ }) {
    const response = await this.databricks.setSQLWarehousePermissions({
      warehouseId: this.warehouseId,
      data: this.permissions,
      $,
    });

    $.export("$summary", `Successfully updated permissions for SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },
};
