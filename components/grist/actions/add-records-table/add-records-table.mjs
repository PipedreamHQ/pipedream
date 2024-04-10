import grist from "../../grist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grist-add-records-table",
  name: "Add Records to Table",
  description: "Appends new records to a chosen table in Grist. [See the documentation](https://support.getgrist.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    grist,
    tableName: {
      propDefinition: [
        grist,
        "tableName",
      ],
    },
    recordsData: {
      propDefinition: [
        grist,
        "recordsData",
      ],
    },
  },
  async run({ $ }) {
    const records = this.recordsData.map(JSON.parse);
    const response = await this.grist.appendRecords({
      tableName: this.tableName,
      recordsData: records,
    });

    $.export("$summary", `Successfully appended ${records.length} records to the table ${this.tableName}`);
    return response;
  },
};
