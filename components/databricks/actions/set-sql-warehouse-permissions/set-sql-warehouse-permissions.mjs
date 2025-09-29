import databricks from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "databricks-set-sql-warehouse-permissions",
  name: "Set SQL Warehouse Permissions",
  description: "Updates the permissions for a specific SQL Warehouse. [See docs](https://docs.databricks.com/api/workspace/warehouses/setpermissions)",
  version: "0.0.4",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      description: "The ID of the SQL Warehouse to update permissions for",
      propDefinition: [
        databricks,
        "warehouseId",
      ],
    },
    accessControlList: {
      type: "string[]",
      label: "Access Control List",
      description: "List of access control entries. Each entry must include one of `user_name`, `group_name`, or `service_principal_name`, and a `permission_level` (`CAN_VIEW`, `CAN_MONITOR`, `CAN_USE`, `CAN_MANAGE`).",
    },
  },
  async run({ $ }) {
    let acl = utils.parseObject(this.accessControlList);
    if (!Array.isArray(acl)) {
      throw new ConfigurationError("Access Control List must be an array");
    }
    acl = acl.filter((entry) => entry && Object.keys(entry).length > 0);

    const response = await this.databricks.setSQLWarehousePermissions({
      warehouseId: this.warehouseId,
      data: {
        access_control_list: acl,
      },
      $,
    });

    $.export("$summary", `Successfully updated permissions for SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },

};
