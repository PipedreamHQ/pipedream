import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-delete-sql-warehouse",
  name: "Delete SQL Warehouse",
  description: "Deletes a SQL Warehouse by ID. [See the documentation](https://docs.databricks.com/api/workspace/warehouses/delete)",
  version: "0.0.3",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      description: "The ID of the SQL Warehouse to delete",
      propDefinition: [
        databricks,
        "warehouseId",
      ],
    },
  },
  async run({ $ }) {
    await this.databricks.deleteSQLWarehouse({
      warehouseId: this.warehouseId,
      $,
    });

    $.export("$summary", `Successfully deleted SQL Warehouse with ID ${this.warehouseId}`);
    return {
      success: true,
    };
  },
};
