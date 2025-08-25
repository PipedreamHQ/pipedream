import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-edit-sql-warehouse",
  name: "Edit SQL Warehouse",
  description: "Edits the configuration of an existing SQL Warehouse. [See docs](https://docs.databricks.com/api/workspace/warehouses/edit)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of the SQL Warehouse to edit",
    },
    body: {
      type: "object",
      label: "Edit Configuration",
      description: "The new configuration for the SQL Warehouse (JSON object). Example: `{ \"name\": \"Updated Warehouse\", \"cluster_size\": \"2X-Small\" }`",
    },
  },
  async run({ $ }) {
    const response = await this.databricks.editSQLWarehouse({
      warehouseId: this.warehouseId,
      data: this.body,
      $,
    });

    $.export("$summary", `Successfully edited SQL Warehouse ID ${this.warehouseId}`);
    return response;
  },
};
