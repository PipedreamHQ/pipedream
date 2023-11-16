import appdrag from "../../appdrag.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "appdrag-insert-row",
  name: "Insert Row",
  description: "Inserts a new row into a cloud database table. [See the documentation](https://support.appdrag.com/doc/CloudDB-API)",
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
    rowData: {
      type: "object",
      label: "Row Data",
      description: "The data for the new row to insert, formatted as an object where each key is a column name.",
    },
  },
  async run({ $ }) {
    const response = await this.appdrag.insertRow({
      tableId: this.tableId,
      data: this.rowData,
    });
    $.export("$summary", `Successfully inserted a new row into table ID ${this.tableId}`);
    return response;
  },
};
