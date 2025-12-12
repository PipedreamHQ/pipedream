import glide from "../../glide.app.mjs";

export default {
  key: "glide-delete-row",
  name: "Delete Row",
  description: "Delete an existing row from a table. [See the documentation](https://apidocs.glideapps.com/api-reference/v2/tables/delete-table-row)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    glide,
    tableId: {
      propDefinition: [
        glide,
        "tableId",
      ],
    },
    rowId: {
      propDefinition: [
        glide,
        "rowId",
        ({ tableId }) => ({
          tableId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.glide.deleteRow({
      $,
      tableId: this.tableId,
      rowId: this.rowId,
    });

    $.export("$summary", `Successfully deleted row ${this.rowId}`);
    return response;
  },
};

