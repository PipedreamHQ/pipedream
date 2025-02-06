import appsheet from "../../appsheet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "appsheet-add-row",
  name: "Add Row",
  description: "Adds a new row to a specific table in an AppSheet app. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    appsheet,
    rowData: {
      type: "object",
      label: "Row Data",
      description: "JSON object representing the new row data",
    },
  },
  async run({ $ }) {
    const response = await this.appsheet.addRow(this.rowData);
    $.export("$summary", "Added a new row successfully");
    return response;
  },
};
