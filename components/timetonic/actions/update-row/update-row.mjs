import timetonic from "../../timetonic.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "timetonic-update-row",
  name: "Update Row",
  description: "Updates the values within a specified row in a table.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timetonic,
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
      ],
    },
    rowId: {
      propDefinition: [
        timetonic,
        "rowId",
      ],
    },
    fields: {
      propDefinition: [
        timetonic,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.timetonic.editTableRow(this.tableId, this.rowId, this.fields);
    $.export("$summary", `Successfully updated row ${this.rowId} in table ${this.tableId}`);
    return response;
  },
};
