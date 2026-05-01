import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-delete-sql-warehouse",
  name: "Delete SQL Warehouse",
  description: "Deletes a SQL Warehouse by ID. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/delete)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks_oauth,
    warehouseId: {
      description: "The ID of the SQL Warehouse to delete",
      propDefinition: [
        databricks_oauth,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    await this.databricks_oauth.deleteSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Successfully deleted SQL Warehouse with ID ${this.warehouseId}`);
    return {
      success: true,
    };
  },
};
