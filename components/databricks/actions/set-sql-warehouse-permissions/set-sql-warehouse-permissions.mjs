import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-set-sql-warehouse-permissions",
  name: "Set SQL Warehouse Permissions",
  description: "Updates the permissions for a specific SQL Warehouse. [See docs](https://docs.databricks.com/api/workspace/warehouses/setpermissions)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of the SQL Warehouse to update permissions for",
    },
    accessControlList: {
      type: "object[]",
      label: "Access Control List",
      description: "List of access control entries. Each entry must include one of `user_name`, `group_name`, or `service_principal_name`, and a `permission_level` (`CAN_VIEW`, `CAN_MONITOR`, `CAN_USE`, `CAN_MANAGE`).",
      properties: {
        user_name: { type: "string", optional: true },
        group_name: { type: "string", optional: true },
        service_principal_name: { type: "string", optional: true },
        permission_level: { 
          type: "string", 
          options: ["CAN_VIEW", "CAN_MONITOR", "CAN_USE", "CAN_MANAGE"] 
        },
      },
    },
  },
  async run({ $ }) {
    const response = await this.databricks.setSQLWarehousePermissions({
      warehouseId: this.warehouseId,
      data: {
        access_control_list: this.accessControlList,
      },
      $,
    });

    $.export("$summary", `Successfully updated permissions for SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },
};
