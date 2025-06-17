import keboola from "../../keboola.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "keboola-update-table-name",
  name: "Update Table Name",
  description: "Update the name of a table. [See the documentation](https://keboola.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    keboola,
    tableId: {
      propDefinition: [
        keboola,
        "tableId",
      ],
    },
    name: {
      type: "string",
      label: "New Table Name",
      description: "The new name for the table",
    },
  },
  async run({ $ }) {
    const response = await this.keboola.updateTableName({
      tableId: this.tableId,
      name: this.name,
    });
    $.export("$summary", `Successfully updated table name to ${this.name}`);
    return response;
  },
};
