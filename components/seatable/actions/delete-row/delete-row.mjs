import seatable from "../../seatable.app.mjs";

export default {
  key: "seatable-delete-row",
  name: "Delete Row",
  description: "Deletes a specific row from a specified table. [See the documentation](https://api.seatable.io/reference/delete-row)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    seatable,
    tableName: {
      propDefinition: [
        seatable,
        "tableName",
      ],
    },
    rowId: {
      propDefinition: [
        seatable,
        "rowId",
        (c) => ({
          tableName: c.tableName,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.seatable.deleteRow({
      $,
      baseUuid: await this.seatable.getBaseUuid({
        $,
      }),
      data: {
        table_name: this.tableName,
        row_id: this.rowId,
      },
    });
    $.export("$summary", `Successfully deleted row with ID ${this.rowId}`);
    return response;
  },
};
