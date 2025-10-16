import timetonic from "../../timetonic.app.mjs";

export default {
  key: "timetonic-delete-row",
  name: "Delete Row",
  description: "Deletes a row within an existing table in TimeTonic. [See the documentation](https://timetonic.com/live/apidoc/#api-Smart_table_operations-deleteTableRow)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    timetonic,
    bookCode: {
      propDefinition: [
        timetonic,
        "bookCode",
      ],
    },
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
        (c) => ({
          bookCode: c.bookCode,
        }),
      ],
    },
    rowId: {
      propDefinition: [
        timetonic,
        "rowId",
        (c) => ({
          tableId: c.tableId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.timetonic.deleteRow({
      $,
      params: {
        rowId: this.rowId,
      },
    });
    $.export("$summary", `Successfully deleted row with ID ${this.rowId}`);
    return response;
  },
};
