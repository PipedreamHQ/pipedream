import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-create-sql-warehouse",
  name: "Create SQL Warehouse",
  description: "Creates a new SQL Warehouse in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/create)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    name: {
      type: "string",
      label: "Warehouse Name",
      description: "A human-readable name for the warehouse",
    },
    clusterSize: {
      type: "string",
      label: "Cluster Size",
      description: "Size of the cluster (e.g., `Small`, `Medium`, `Large`)",
    },
    autoStopMinutes: {
      type: "integer",
      label: "Auto Stop (minutes)",
      description: "Number of minutes of inactivity before the warehouse auto-stops",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    const payload = {
      name: this.name,
      cluster_size: this.clusterSize,
      auto_stop_mins: this.autoStopMinutes,
    };

    const response = await this.databricks.createSQLWarehouse({
      data: payload,
      $,
    });

    $.export("$summary", `Successfully created SQL Warehouse: ${response?.name || this.name}`);
    return response;
  },
};
