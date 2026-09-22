import sidetracker from "../../sidetracker.app.mjs";

export default {
  key: "sidetracker-get-row-from-list",
  name: "Get Row from List",
  description: "Get a row from a list. [See the documentation](https://app.sidetracker.io/api/schema/redoc#tag/Lists/operation/ListGetRow)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sidetracker,
    listId: {
      propDefinition: [
        sidetracker,
        "listId",
      ],
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The unique ID of a row. Visible when viewing the list in Sidetracker. Example: `dwx75i8w`",
    },
  },
  async run({ $ }) {
    const response = await this.sidetracker.getRow({
      $,
      listId: this.listId,
      rowId: this.rowId,
    });

    $.export("$summary", `Successfully fetched row with ID ${this.rowId}.`);

    return response;
  },
};
