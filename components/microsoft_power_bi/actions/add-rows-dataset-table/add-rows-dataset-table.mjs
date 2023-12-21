import { ConfigurationError } from "@pipedream/platform";
import powerBi from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-add-rows-dataset-table",
  name: "Add Rows to Dataset Table",
  description: "Adds new data rows to the specified table within the specified dataset from My workspace. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/push-datasets/datasets-post-rows)",
  version: "0.0.1",
  type: "action",
  props: {
    powerBi,
    datasetId: {
      propDefinition: [
        powerBi,
        "datasetId",
      ],
    },
    tableName: {
      propDefinition: [
        powerBi,
        "tableName",
        ({ datasetId }) => ({
          datasetId,
        }),
      ],
    },
    rows: {
      propDefinition: [
        powerBi,
        "rows",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.powerBi.addRowsToTable({
      $,
      datasetId: this.datasetId,
      tableName: this.tableName,
      data: {
        rows: this.rows.map((row, index) => {
          try {
            return JSON.parse(row);
          } catch (err) {
            throw new ConfigurationError(`Error parsing entry index ${index} as JSON: \`${row}\``);
          }
        }),
      },
    });

    $.export("$summary", `Successfully added rows to table "${this.tableName}"`);
    return response;
  },
};
