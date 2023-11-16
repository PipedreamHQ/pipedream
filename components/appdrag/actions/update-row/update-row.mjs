import appdrag from "../../appdrag.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "appdrag-update-row",
  name: "Update Row",
  description: "Updates a row in a cloud database table. [See the documentation](https://support.appdrag.com/doc/API-CloudBackend)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    appdrag,
    tableId: {
      propDefinition: [
        appdrag,
        "tableId",
      ],
    },
    rowId: {
      propDefinition: [
        appdrag,
        "rowId",
        (c) => ({
          tableId: c.tableId,
        }),
      ],
    },
    rowData: {
      type: "object",
      label: "Row Data",
      description: "The data to update in the row, formatted as an object where each key is a column name.",
    },
  },
  async run({ $ }) {
    const response = await this.appdrag.updateRow({
      tableId: this.tableId,
      rowId: this.rowId,
      data: this.rowData,
    });

    $.export("$summary", `Successfully updated row with ID ${this.rowId}`);
    return response;
  },
};
